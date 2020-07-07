let now = new Date();
let calendarId = 'primary';
let advisorData = {};
advisorData.fullName = "Yoshi Akutsu";
advisorData.position = "Client Planning Advisor";
advisorData.phoneExtension = "709";
advisorData.advisorEmail = "yoshi@collegeliftoff.com";
advisorFolderId = "1Q_eXO663PGZHTxhkxVYmyAtgUw4A_o0T";

function main() {
  let todaysEvents = getOneDaysEvents();
  let events = Calendar.Events.list(calendarId, {timeMin: now.toISOString(), orderBy: 'startTime', singleEvents: true, maxResults: todaysEvents.length}).items;
  for (let i = 0; i < todaysEvents.length; i++) {
    let event = events[i];
    Logger.log(event.summary, event.hangoutLink, event.attendees, event.start, event.end);
    if(event.summary.includes('angout')) {
      draftEmail(event);
    }
  }
}

function militaryToTwelve(militaryHour, minutes) {
  if (militaryHour >= 12 && militaryHour < 13) {
    let twelveHour = militaryHour;
    twelveHour = twelveHour + ":" + minutes + "pm";
    return twelveHour;
  }
  else if (militaryHour >= 13) {
    let twelveHour = militaryHour - 12;
    twelveHour = twelveHour + ":" + minutes + "pm";
    return twelveHour;
  }
  else {
    let twelveHour = militaryHour;
    twelveHour = twelveHour + ":" + minutes + "am";    
    return twelveHour;
  }
}

function prettifyDate(datetime) {
  let time = datetime.split("T")[1];
  let hourMinuteSecond = time.split("-")[0];
  let hour = hourMinuteSecond.split(":")[0];
  let minute = hourMinuteSecond.split(":")[1];
  
  return militaryToTwelve(hour, minute);
}

function getEmails(attendees) {
  let stringifiedEmails = '';
  for (let i = 0; i < attendees.length; i++) {
    stringifiedEmails = stringifiedEmails + attendees[i].email;
    if (i != attendees.length) {
      stringifiedEmails = stringifiedEmails + ',';
    }
  }
  return stringifiedEmails;
}

function getName(eventTitle) {
  let array = eventTitle.split("-");
  return array[1].trim();
}

function draftEmail(event) {
  let template = HtmlService.createTemplateFromFile('email');
  template.name = getName(event.summary);
  template.link = event.hangoutLink;
  template.startTime = prettifyDate(event.start.dateTime);
  template.endTime = prettifyDate(event.end.dateTime);
  template.advisor = advisorData;

  
  let message = template.evaluate().getContent();
  GmailApp.createDraft(getEmails(event.attendees), 'Link to the call', message, { htmlBody: message });
}

function getOneDaysEvents() {
  let events = CalendarApp.getDefaultCalendar().getEventsForDay(now);
  return events;
}