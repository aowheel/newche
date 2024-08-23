"use server";

import { z } from "zod";

const monthFormat = async (month?: string) => {
  let restricted = true;
  const splitMonth = month?.split("-");
  let startDate = new Date(Number(splitMonth?.[0]), Number(splitMonth?.[1]) - 1);
  startDate.setTime(startDate.getTime() - 9*60*60*1000);
  let endDate = new Date(Number(splitMonth?.[0]), Number(splitMonth?.[1]));
  endDate.setTime(endDate.getTime() - 9*60*60*1000);
  let gte = z.date().safeParse(startDate).data;
  let lt = z.date().safeParse(endDate).data;
  if (!gte || !lt) {
    gte = new Date();
    gte.setTime(gte.getTime() - 9*60*60*1000);
    restricted = false;
  }
  let caption = "UP TO DATE";
  if (restricted) {
    caption = `${splitMonth?.[0]} / ${splitMonth?.[1]}`;
  }
  return {
    gte: gte,
    lt: lt,
    caption: caption
  };
}

export default monthFormat;
