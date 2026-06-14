"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useUnits } from "@/context/UnitContext";
import type { SleepLog } from "@/context/HealthDataContext";

type SleepStage = "awake" | "rem" | "light" | "deep";

type SleepStageSegment = {
  stage: SleepStage;
  minutes: number;
};

type SleepWindow = {
  start: Date;
  end: Date;
};

interface SleepStagesChartProps {
  sleepLogs: SleepLog[];
  className?: string;
}

const stageMeta: Record<
  SleepStage,
  {
    label: string;
    color: string;
    stroke?: string;
    y: number;
    height: number;
  }
> = {
  awake: {
    label: "Awake",
    color: "#FFB2AB",
    y: 26,
    height: 26,
  },
  rem: {
    label: "REM",
    color: "#D0BCFF",
    y: 52,
    height: 30,
  },
  light: {
    label: "Light",
    color: "#FFFFFF",
    stroke: "#E8DEF8",
    y: 80,
    height: 32,
  },
  deep: {
    label: "Deep",
    color: "#6750A4",
    y: 108,
    height: 34,
  },
};

const stagePattern: Array<{ stage: SleepStage; minutes: number }> = [
  { stage: "light", minutes: 12 },
  { stage: "deep", minutes: 24 },
  { stage: "light", minutes: 38 },
  { stage: "rem", minutes: 18 },
  { stage: "light", minutes: 42 },
  { stage: "deep", minutes: 20 },
  { stage: "light", minutes: 36 },
  { stage: "rem", minutes: 26 },
  { stage: "awake", minutes: 5 },
  { stage: "light", minutes: 46 },
  { stage: "deep", minutes: 18 },
  { stage: "light", minutes: 34 },
  { stage: "rem", minutes: 30 },
  { stage: "light", minutes: 52 },
  { stage: "awake", minutes: 4 },
  { stage: "light", minutes: 38 },
  { stage: "deep", minutes: 16 },
  { stage: "light", minutes: 44 },
  { stage: "rem", minutes: 28 },
];

const parseLocalDate = (dateString: string) => {
  const [year, month, day] = dateString.split("-").map(Number);

  if (!year || !month || !day) {
    return new Date();
  }

  return new Date(year, month - 1, day);
};

const getTimeParts = (timeString: string) => {
  const [hoursString, minutesString] = timeString.split(":");

  return {
    hours: Number(hoursString) || 0,
    minutes: Number(minutesString) || 0,
  };
};

const dateWithTime = (date: Date, timeString: string) => {
  const { hours, minutes } = getTimeParts(timeString);
  const nextDate = new Date(date);

  nextDate.setHours(hours, minutes, 0, 0);

  return nextDate;
};

const getSleepWindow = (log: SleepLog): SleepWindow => {
  const date = parseLocalDate(log.date);
  const start = log.startTime
    ? dateWithTime(date, log.startTime)
    : (() => {
        const fallbackStart = new Date(date);
        fallbackStart.setHours(22, 0, 0, 0);
        return fallbackStart;
      })();

  let end = log.endTime ? dateWithTime(date, log.endTime) : null;

  if (!end || end <= start) {
    end = new Date(start.getTime() + Math.max(log.hrs, 0) * 60 * 60 * 1000);
  }

  return { start, end };
};

const getSleepMinutes = (log: SleepLog) => {
  const { start, end } = getSleepWindow(log);

  return Math.max(1, Math.round((end.getTime() - start.getTime()) / 60000));
};

const generateStageSegments = (totalMinutes: number) => {
  const segments: SleepStageSegment[] = [];
  let remaining = totalMinutes;
  let patternIndex = 0;

  while (remaining > 0) {
    const pattern = stagePattern[patternIndex % stagePattern.length];
    const minutes = Math.min(pattern.minutes, remaining);

    if (minutes > 0.5) {
      const previous = segments[segments.length - 1];

      if (previous && previous.stage === pattern.stage) {
        previous.minutes += minutes;
      } else {
        segments.push({ stage: pattern.stage, minutes });
      }
    }

    remaining -= minutes;
    patternIndex += 1;
  }

  return segments;
};

const formatShortDate = (date: Date) => {
  return new Intl.DateTimeFormat("en", {
    month: "numeric",
    day: "numeric",
  }).format(date);
};

const toTimeString = (date: Date) => {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
};

const SleepStagesChart = ({ sleepLogs, className }: SleepStagesChartProps) => {
  const { formatTime } = useUnits();
  const latestLog = sleepLogs[sleepLogs.length - 1];

  if (!latestLog) {
    return (
      <div className={cn("rounded-[28px] bg-[#F8F7FF] p-6 text-center", className)}>
        <p className="text-sm font-medium text-gray-400">
          Log a sleep period to generate your sleep stage timeline.
        </p>
      </div>
    );
  }

  const { start, end } = getSleepWindow(latestLog);
  const totalMinutes = getSleepMinutes(latestLog);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const segments = generateStageSegments(totalMinutes);

  const chartX = 24;
  const chartY = 28;
  const chartWidth = 472;
  const chartHeight = 128;

  let elapsedMinutes = 0;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Sleep
          </p>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-5xl font-black text-[#1A1C1E]">{hours}</span>
            <span className="text-xs font-bold text-gray-400">h</span>
            <span className="text-4xl font-black text-[#1A1C1E]">{minutes}</span>
            <span className="text-xs font-bold text-gray-400">m</span>
          </div>
        </div>

        <div className="text-right text-xs text-gray-400">
          <p>{formatShortDate(start)}</p>
          <p className="font-medium text-[#6750A4]">Bedtime {formatTime(toTimeString(start))}</p>
        </div>
      </div>

      <div className="rounded-[30px] bg-[#F8F7FF] p-4">
        <svg
          viewBox="0 0 520 190"
          className="h-[180px] w-full"
          role="img"
          aria-label={`Sleep stages from ${formatTime(toTimeString(start))} to ${formatTime(toTimeString(end))}`}
        >
          <rect
            x={chartX}
            y={chartY}
            width={chartWidth}
            height={chartHeight}
            rx={24}
            fill="#FFFFFF"
          />

          {[0.25, 0.5, 0.75].map((position) => (
            <line
              key={position}
              x1={chartX + chartWidth * position}
              x2={chartX + chartWidth * position}
              y1={chartY + 8}
              y2={chartY + chartHeight - 8}
              stroke="#E8DEF8"
              strokeDasharray="3 7"
              strokeWidth={1}
            />
          ))}

          {segments.map((segment) => {
            const meta = stageMeta[segment.stage];
            const x = chartX + (elapsedMinutes / totalMinutes) * chartWidth;
            const width = Math.max(1.5, (segment.minutes / totalMinutes) * chartWidth);
            const radius = Math.min(7, width / 2);

            elapsedMinutes += segment.minutes;

            return (
              <rect
                key={`${segment.stage}-${x}-${width}`}
                x={x}
                y={meta.y}
                width={width}
                height={meta.height}
                rx={radius}
                fill={meta.color}
                stroke={meta.stroke ?? meta.color}
                strokeWidth={meta.stroke ? 1 : 0}
              />
            );
          })}
        </svg>
      </div>

      <div className="flex items-center justify-between gap-2 text-[10px] text-gray-400">
        <div className="text-left">
          <p>{formatShortDate(start)}</p>
          <p>Bedtime {formatTime(toTimeString(start))}</p>
        </div>

        <div className="text-right">
          <p>{formatShortDate(end)}</p>
          <p>Woke up {formatTime(toTimeString(end))}</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {(Object.keys(stageMeta) as SleepStage[]).map((stage) => {
          const meta = stageMeta[stage];

          return (
            <div
              key={stage}
              className="flex items-center justify-center gap-1.5 rounded-full bg-white/70 px-2 py-1.5"
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  background: meta.color,
                  border: meta.stroke ? "1px solid #E8DEF8" : "none",
                }}
              />
              <span className="text-[10px] font-semibold text-gray-500">
                {meta.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SleepStagesChart;