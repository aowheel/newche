"use server";

import prisma from "@/lib/prisma";
import monthFormat from "./month-format";
import dateFormat from "./date-format";

export const getSchedule = async (month?: string) => {
  const { gte, lt, caption } = await monthFormat(month);
  const schedule = await prisma.schedule.findMany({
    where: {
      date: {
        gte: gte,
        lt: lt
      }
    },
    orderBy: {
      date: "asc"
    },
    select: {
      id: true,
      type: true,
      date: true,
      start: true,
      end: true,
      description: true
    }
  });

  const dateOption = {
    month: "numeric",
    day: "numeric",
    weekday: "short"
  };
  const timeOption =  {
    hour: "numeric",
    minute: "2-digit"
  };

  return {
    caption: caption,
    schedule: schedule.map(item => (
      {
        ...item,
        date: dateFormat(item.date, dateOption),
        start: dateFormat(item.start || undefined, timeOption),
        end: dateFormat(item.end || undefined, timeOption)
      }
    ))
  };
}

export const getLatestSchedule = async () => {
  const gte = new Date();
  gte.setTime(gte.getTime() - 9*60*60*1000);
  
  const schedule = await prisma.schedule.findFirst({
    where: {
      date: {
        gte: gte
      }
    },
    orderBy: {
      date: "asc"
    },
    select: {
      date: true,
      start: true,
      end: true
    }
  });

  if (!schedule) return undefined;
  
  const dateOption = {
    month: "numeric",
    day: "numeric"
  }
  const timeOption =  {
    hour: "numeric",
    minute: "2-digit"
  }

  return {
    date: dateFormat(schedule.date, dateOption),
    start: dateFormat(schedule.start || undefined, timeOption),
    end: dateFormat(schedule.end || undefined, timeOption)
  }
}

export const getSevenDaysSchedule = async () => {
  const currentDate = new Date();
  currentDate.setTime(currentDate.getTime() - 9*60*60*1000);
  const gte = currentDate;
  const sevenDaysLater = new Date(currentDate);
  sevenDaysLater.setDate(currentDate.getDate() + 7);
  const lt = sevenDaysLater;

  const schedule = await prisma.schedule.findMany({
    where: {
      date: {
        gte: gte,
        lt: lt
      }
    },
    orderBy: {
      date: "asc"
    },
    select: {
      id: true,
      type: true,
      date: true,
      start: true,
      end: true,
      description: true
    }
  });

  const dateOption = {
    month: "numeric",
    day: "numeric",
    weekday: "short"
  };
  const timeOption =  {
    hour: "numeric",
    minute: "2-digit"
  };

  return schedule?.map(item => (
    {
      ...item,
      date: dateFormat(item.date, dateOption),
      start: dateFormat(item.start || undefined, timeOption),
      end: dateFormat(item.end || undefined, timeOption)
    }
  ));
}

export const findLacks = async (userId: string, scheduleIds: number[]) => {
  return !!await prisma.schedule.findFirst({
    where: {
      id: {
        in: scheduleIds
      },
      users: {
        none: {
          userId: userId
        }
      }
    },
    select: { id: true }
  });
}

export const getAttendees = async (scheduleId: number) => {
  const attendees = await prisma.schedule.findUnique({
    where: {
      id: scheduleId
    },
    select: {
      users: {
        where: {
          attendance: "yes"
        },
        orderBy: {
          user: {
            period: "desc"
          }
        },
        select: {
          user: {
            select: {
              id: true,
              image: true,
              displayName: true,
              period: true
            }
          }
        }
      }
    }
  });
  return attendees?.users?.map(item => item.user);
}

export const getAttendance = async (userId: string, scheduleId: number) => {
  return await prisma.attendance.findUnique({
    where: {
      userId_scheduleId: {
        userId: userId,
        scheduleId: scheduleId
      }
    },
    select: {
      attendance: true
    }
  });
}

export const getComments = async (scheduleId: number) => {
  return await prisma.comment.findMany({
    where: {
      scheduleId: scheduleId
    },
    select: {
      userId: true,
      comment: true
    }
  });
}
