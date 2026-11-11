import { useEffect } from "react";
import { IconArrowLeft } from "@tabler/icons-react";
import Social from "./social";
import { holidayShopSchedule } from "../data/holiday-shop-schedule";

const DAY_TONE: Record<string, string> = {
  Monday: "border-roberts_red-300 bg-roberts_red-50/10",
  Tuesday: "border-emerald_green-300 bg-emerald_green-50/10",
  Wednesday: "border-roberts_blue-300 bg-roberts_blue-50/10",
  Thursday: "border-gamboge-200 bg-gamboge-50/10",
  Friday: "border-roberts_blue-100 bg-white/5",
};

export default function HolidayShopSchedulePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    const previous = document.title;
    document.title = "Holiday Shop class schedule | Roberts Elementary PTA";
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <main className="relative mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 pb-16 pt-6 sm:px-6 sm:pt-10">
      <a
        href="#/"
        className="inline-flex w-fit items-center gap-1.5 rounded-full border-2 border-roberts_blue-200 px-3.5 py-2 text-sm font-semibold text-roberts_blue-50 outline-none transition-colors hover:bg-roberts_blue-50 hover:text-roberts_blue-900 focus-visible:ring-4 focus-visible:ring-[#ffc94a]"
      >
        <IconArrowLeft size={18} aria-hidden="true" />
        Back to PTA links
      </a>

      <header className="flex flex-col gap-2">
        <h1 className="font-display text-4xl leading-tight text-white sm:text-5xl">
          {holidayShopSchedule.title}
        </h1>
        <p className="max-w-xl text-lg font-medium text-roberts_blue-100">
          Assigned Shopping Days: {holidayShopSchedule.assigned}
        </p>
        <p className="max-w-xl text-sm font-semibold text-[#ffc94a]">
          {holidayShopSchedule.makeupNote}
        </p>
      </header>

      <div className="flex flex-col gap-6">
        {holidayShopSchedule.days.map((day) => (
          <section
            key={day.weekday}
            aria-labelledby={`${day.weekday}-heading`}
            className={`overflow-hidden rounded-2xl border-2 ${DAY_TONE[day.weekday] ?? ""} bg-roberts_blue-800/60`}
          >
            <h2
              id={`${day.weekday}-heading`}
              className="px-4 pt-4 font-display text-2xl text-white sm:px-5"
            >
              {day.weekday} {day.date}
            </h2>
            <table className="mt-3 w-full border-collapse text-left text-sm sm:text-base">
              <thead className="sr-only">
                <tr>
                  <th>Shop time</th>
                  <th>Grade</th>
                  <th>Teacher</th>
                </tr>
              </thead>
              <tbody>
                {day.slots.map((slot) => (
                  <tr
                    key={slot.time}
                    className="border-t border-white/10 text-roberts_blue-50"
                  >
                    <td className="whitespace-nowrap px-4 py-2 font-semibold sm:px-5">
                      {slot.time}
                    </td>
                    {slot.grade ? (
                      <>
                        <td className="px-2 py-2 font-medium">{slot.grade}</td>
                        <td className="px-2 py-2 pr-4 font-medium sm:pr-5">
                          {slot.teacher}
                        </td>
                      </>
                    ) : (
                      <td
                        colSpan={2}
                        className="px-2 py-2 pr-4 font-medium italic opacity-80 sm:pr-5"
                      >
                        {slot.teacher}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ))}
      </div>

      <p className="text-sm font-medium text-roberts_blue-100">
        Questions about your shopping time? Reach out to your child's teacher.
      </p>
      <Social />
    </main>
  );
}
