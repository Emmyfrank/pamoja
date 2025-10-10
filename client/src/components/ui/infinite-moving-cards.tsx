import React, { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { motion, useAnimation } from "framer-motion";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    quote: string;
    name: string; 
    title: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const controls = useAnimation();
  const [width, setWidth] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Quadruple the items to ensure smooth infinite scroll
  const quadrupleItems = [...items, ...items, ...items, ...items];

  useEffect(() => {
    const calculateWidth = () => {
      const scrollerContent = document.querySelector(".scroller-content");
      if (scrollerContent) {
        const singleSetWidth = scrollerContent.scrollWidth / 4;
        setWidth(singleSetWidth);
      }
    };

    calculateWidth();
    window.addEventListener("resize", calculateWidth);

    return () => window.removeEventListener("resize", calculateWidth);
  }, [items]);

  useEffect(() => {
    const speedDurations = {
      fast: 20,
      normal: 40,
      slow: 80,
    };

    const animate = async () => {
      const baseX = direction === "left" ? -width : width;

      // Start from the middle to ensure smooth looping
      await controls.set({ x: 0 });

      await controls.start({
        x: baseX,
        transition: {
          duration: speedDurations[speed],
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
          repeatDelay: 0,
        },
      });
    };

    if (width > 0 && !isPaused && !isDragging) {
      animate();
    }

    return () => {
      controls.stop();
    };
  }, [width, direction, speed, controls, isPaused, isDragging]);

  const handleDragStart = () => {
    setIsDragging(true);
    setIsPaused(true);
  };

  const handleDragEnd = (event: any, info: any) => {
    setIsDragging(false);
    setIsPaused(false);

    // Calculate the velocity-based offset
    const velocity = info.velocity.x;
    const offset =
      Math.sign(velocity) * Math.min(Math.abs(velocity * 0.2), width / 2);

    // Animate to the nearest position and then resume the infinite scroll
    controls
      .start({
        x: offset,
        transition: { duration: 0.5, ease: "easeOut" },
      })
      .then(() => {
        controls.start({
          x: direction === "left" ? -width : width,
          transition: {
            duration: speed === "fast" ? 20 : speed === "normal" ? 40 : 80,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          },
        });
      });
  };

  return (
    <div
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <motion.div
        className="flex gap-4 py-4 w-max flex-nowrap scroller-content"
        animate={controls}
        drag="x"
        dragConstraints={{ left: -width, right: width }}
        dragElastic={0.2}
        dragMomentum={true}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        style={
          {
            "--slate-800": "rgb(30 41 59)",
            "--slate-900": "rgb(15 23 42)",
          } as React.CSSProperties
        }
      >
        {quadrupleItems.map((item, idx) => (
          <div
            key={idx}
            className="w-[350px] max-w-full relative rounded-2xl border border-b-0 flex-shrink-0 border-slate-700 px-8 py-6 md:w-[450px]"
            style={{
              background:
                "linear-gradient(180deg, var(--slate-800), var(--slate-900))",
            }}
          >
            <blockquote>
              <div
                aria-hidden="true"
                className="user-select-none -z-1 pointer-events-none absolute -left-0.5 -top-0.5 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
              ></div>
              <span className="relative z-20 text-sm leading-[1.6] text-gray-100 font-normal">
                {item.quote}
              </span>
              <div className="relative z-20 mt-6 flex flex-row items-center">
                <span className="flex flex-col gap-1">
                  <span className="text-sm leading-[1.6] text-gray-400 font-normal">
                    {item.name}
                  </span>
                  <span className="text-sm leading-[1.6] text-gray-400 font-normal">
                    {item.title}
                  </span>
                </span>
              </div>
            </blockquote>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
