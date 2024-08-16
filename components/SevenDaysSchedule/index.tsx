"use server";

import { getAttendees, getSevenDaysSchedule, hasLacks } from "@/utils/schedule-data";
import Image from "next/image";
import { Suspense } from "react";
import { FaArrowRight } from "react-icons/fa6";
import { MdArrowRight } from "react-icons/md";

const Attendees = async ({ scheduleId }: { scheduleId: number }) => {
  const attendees = await getAttendees(scheduleId);

  let initialValue: {
    period: number | null,
    others: {
      displayName: string | null,
      image: string | null
    }[]
  }[] = [];
  const attendeesGroup = attendees?.reduce((accumulator, { period, displayName, image }) => {
    const lastEntry = accumulator[accumulator.length - 1];
    if (!!lastEntry && lastEntry.period === period) {
      lastEntry.others.push({displayName, image});
    } else {
      accumulator.push({ period, others: [{displayName, image}] });
    }
    return accumulator;
  }, initialValue);
  return (
    <tbody>
      {attendeesGroup?.map((item, index) => {
        return (
          <tr key={index}>
            <th>{item.period}期</th>
            <td className="overflow-x-auto flex gap-x-2 items-center">
              {item.others?.map((item, index) => {
                return (
                  <span key={index} className="flex flex-shrink-0 gap-x-1">
                    <Image
                      src={item.image || ""}
                      alt="icon"
                      width={28}
                      height={28}
                      className="rounded-full w-7 h-7"
                    />
                    <span>{item.displayName}</span>
                  </span>
                );
              })}
            </td>
          </tr>
        );
      })}
    </tbody>
  );
}

const SevenDaysSchedule = async ({ userId }: { userId: string }) => {
  const schedule = await getSevenDaysSchedule();

  if (!!await hasLacks(userId, schedule.map(item => item.id))) {
    return <FaArrowRight className="m-8 text-white text-5xl" />
  }

  return (
    schedule?.map((item, index) => {
      return (
        <div key={index} className="w-full overflow-x-auto p-2 rounded-lg border-2">
          <table key={index} className="w-full text-white text-lg">
            <caption className="w-full p-2 text-xl">
              <span className="flex gap-x-2 items-center">
                <span>{item.date}</span>
                <span className="flex items-center">
                  <span>{item.start}</span>
                  <MdArrowRight />
                  <span>{item.end}</span>
                </span>
                {!!item.description &&
                <span>{item.description}</span>}
              </span>
            </caption>
            <Suspense>
              <Attendees scheduleId={item.id} />
            </Suspense>
          </table>
        </div>
      );
    })
  );
}

export default SevenDaysSchedule;
