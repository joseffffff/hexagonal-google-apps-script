import { CalendarService } from '../../../domain/services/CalendarService';
import { User } from '../../../domain/entities/User';
import CalendarEvent = GoogleAppsScript.Calendar.CalendarEvent;

export class GasCalendarService implements CalendarService {

  public createAllDayEvent(
    name: string,
    date: Date,
    place: string,
    description: string,
    guests: User[],
  ): string {

    return CalendarApp.getDefaultCalendar().createAllDayEvent(
      name,
      date,
      {
        description,
        location: place,
        guests: guests.map(guest => guest.email).join(','),
        sendInvites: true,
      },
    ).getId();
  }

  public updateAllDayEvent(
    calendarEventId: string,
    name: string,
    date: Date,
    place: string,
    description: string,
  ): void {

    const calendarEvent: CalendarEvent = CalendarApp.getEventById(calendarEventId);

    if (!!calendarEvent) {
      calendarEvent.setTitle(name);
      calendarEvent.setAllDayDate(date);
      calendarEvent.setLocation(place);
      calendarEvent.setDescription(description);
    }
  }

  public createEvent(
    name: string,
    startTime: Date,
    endTime: Date,
    place: string,
    description: string,
    guests: User[],
  ): string {

    return CalendarApp.getDefaultCalendar().createEvent(
      name,
      startTime,
      endTime,
      {
        description,
        location: place,
        guests: guests.map(guest => guest.email).join(','),
        sendInvites: true,
      },
    ).getId();
  }

  public deleteEvent(calendarEventId: string): void {
    const calendarEvent: CalendarEvent = CalendarApp.getEventById(calendarEventId);

    if (!!calendarEvent) {
      calendarEvent.deleteEvent();
    }
  }

  public updateEvent(
    calendarEventId: string,
    name: string,
    place: string,
    description: string,
    startTime: Date,
    endTime: Date,
  ): void {

    const calendarEvent: CalendarEvent = CalendarApp.getEventById(calendarEventId);

    if (!!calendarEvent) {
      calendarEvent.setTitle(name);
      calendarEvent.setTime(startTime, endTime);
      calendarEvent.setLocation(place);
      calendarEvent.setDescription(description);
    }
  }

  public deleteEvents(calendarEventIds: string[]): void {
    calendarEventIds.forEach(calendarEventId => {
      try {
        this.deleteEvent(calendarEventId);
      } catch (e) {
        Logger.log(`No calendar event exists with calendarEventId ${calendarEventId}`);
        Logger.log(e);
      }
    });
  }
}
