// Holiday Shop class schedule, from "Holiday Shop Teacher Schedule 2026.pdf".
// Remove once the sale ends (after Dec 4).

// Button shown in item-list.tsx, right under the Holiday Shop online payment button.
export const holidayShopScheduleLink = {
  name: "Holiday Shop class schedule",
  note: "See your child's shop time, Nov 30 to Dec 4",
  url: "#/holiday-shop-schedule",
};

export type ScheduleSlot = {
  time: string;
  grade: string;
  teacher: string;
};

export type ScheduleDay = {
  weekday: string;
  date: string;
  slots: ScheduleSlot[];
};

export const holidayShopSchedule: {
  title: string;
  assigned: string;
  makeupNote: string;
  days: ScheduleDay[];
} = {
  title: "Roberts Elementary Holiday Shop Schedule",
  assigned: "Monday 11/30 – Thursday 12/3 • 9:15 AM – 1:45 PM",
  makeupNote: "Friday 12/4: grade-level make-up shopping",
  days: [
    {
      weekday: "Monday",
      date: "11/30",
      slots: [
        { time: "9:15-9:40", grade: "Fifth Grade", teacher: "Barber" },
        { time: "9:40-10:05", grade: "Fifth Grade", teacher: "Brown" },
        { time: "10:05-10:20", grade: "Pre-K", teacher: "Hannah AM / Ross AM" },
        { time: "10:20-10:45", grade: "Kindergarten", teacher: "Burch" },
        { time: "10:45-11:10", grade: "Fourth Grade", teacher: "Evanko" },
        { time: "11:10-11:35", grade: "Kindergarten", teacher: "McDaniels" },
        { time: "11:35-12:00", grade: "Fourth Grade", teacher: "Lindsey" },
        { time: "12:00-12:25", grade: "Kindergarten", teacher: "Whelan" },
        { time: "12:25-12:50", grade: "Fifth Grade", teacher: "Butler" },
        { time: "12:55-1:20", grade: "Kindergarten", teacher: "Walker" },
        { time: "1:20-1:45", grade: "Fifth Grade", teacher: "McDermott" },
      ],
    },
    {
      weekday: "Tuesday",
      date: "12/1",
      slots: [
        { time: "9:15-9:40", grade: "Fifth Grade", teacher: "Mullinax" },
        { time: "9:40-10:05", grade: "Fifth Grade", teacher: "Reynolds" },
        { time: "10:05-10:30", grade: "Fourth Grade", teacher: "Lopez" },
        { time: "10:45-11:10", grade: "Kindergarten", teacher: "Head" },
        { time: "11:10-11:35", grade: "", teacher: "Inventory / restocking" },
        { time: "11:35-12:00", grade: "Kindergarten", teacher: "Peterson" },
        { time: "12:00-12:25", grade: "First Grade", teacher: "Acuna" },
        { time: "12:25-12:50", grade: "First Grade", teacher: "Dickerson" },
        { time: "12:50-1:15", grade: "Fourth Grade", teacher: "Londraville" },
        { time: "1:15-1:40", grade: "First Grade", teacher: "Murphy" },
      ],
    },
    {
      weekday: "Wednesday",
      date: "12/2",
      slots: [
        { time: "9:15-9:40", grade: "Third Grade", teacher: "Hart" },
        { time: "9:40-10:05", grade: "First Grade", teacher: "Jones" },
        { time: "10:05-10:30", grade: "Third Grade", teacher: "Bartley" },
        { time: "10:30-10:55", grade: "Third Grade", teacher: "Baxter" },
        { time: "10:55-11:20", grade: "Fourth Grade", teacher: "Proux" },
        { time: "11:20-11:40", grade: "", teacher: "Inventory / restocking" },
        { time: "11:40-12:05", grade: "Third Grade", teacher: "Byrd" },
        { time: "12:05-12:30", grade: "Third Grade", teacher: "Grimes" },
        { time: "12:30-12:55", grade: "Second Grade", teacher: "Adams" },
        { time: "12:55-1:20", grade: "Second Grade", teacher: "Bernardino" },
        { time: "1:20-1:45", grade: "First Grade", teacher: "Posey" },
      ],
    },
    {
      weekday: "Thursday",
      date: "12/3",
      slots: [
        { time: "9:15-9:40", grade: "Third Grade", teacher: "Owens" },
        { time: "9:40-10:05", grade: "Third Grade", teacher: "Sexton" },
        { time: "10:05-10:30", grade: "Second Grade", teacher: "Hinson" },
        { time: "10:30-10:55", grade: "Second Grade", teacher: "Labossiere" },
        { time: "10:55-11:20", grade: "Second Grade", teacher: "Marshall" },
        { time: "11:20-11:45", grade: "Second Grade", teacher: "Sanders" },
        { time: "11:45-12:10", grade: "", teacher: "Inventory / restocking" },
        { time: "12:10-12:35", grade: "First Grade", teacher: "Mincy" },
        {
          time: "12:35-1:00",
          grade: "Additional",
          teacher: "Campbell / Damren / Bullion",
        },
        { time: "1:00-1:25", grade: "Pre-K", teacher: "Hannah PM / Ross PM" },
      ],
    },
    {
      weekday: "Friday",
      date: "12/4",
      slots: [
        { time: "9:15-9:45", grade: "First Grade", teacher: "Make-up" },
        { time: "9:45-10:20", grade: "Second Grade", teacher: "Make-up" },
        { time: "10:20-10:55", grade: "Third Grade", teacher: "Make-up" },
        { time: "11:05-11:35", grade: "Fourth Grade", teacher: "Make-up" },
        { time: "11:35-12:05", grade: "Kindergarten", teacher: "Make-up" },
        { time: "12:05-12:30", grade: "Fifth Grade", teacher: "Make-up" },
      ],
    },
  ],
};
