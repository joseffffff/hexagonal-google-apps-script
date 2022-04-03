import { User } from '../entities/User';

export interface CalendarService {
  createAllDayEvent(name: string, date: Date, place: string, description: string, guests: User[]): string;
  updateAllDayEvent(
    calendarEventId: string,
    name: string,
    date?: Date,
    place?: string,
    description?: string,
  ): void;
  createEvent(name: string, startTime: Date, endTime: Date, place: string, description: string, guests: User[]): string;
  deleteEvent(calendarEventId: string): void;
  deleteEvents(calendarEventIds: string[]): void;
  updateEvent(
    calendarEventId: string,
    name: string,
    place: string,
    description: string,
    startTime?: Date,
    endTime?: Date,
  ): void;
}
