import Image from "next/image";
import ThemeToggle from "./ThemeToggle";

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col font-sans
        bg-black text-zinc-50 dark:bg-black dark:text-zinc-50
        light:bg-white light:text-black"
      id="top"
    >
      <ThemeToggle />
      {/* HERO */}
      <main className="flex-1 w-full flex flex-col items-center">
        <section className="w-full max-w-6xl px-6 sm:px-10 lg:px-16 pt-10 pb-16 sm:pt-16 sm:pb-24">
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12">
            {/* Left: Title + CTAs */}
            <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left gap-6">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo_white.png"
                  alt="ROBOCEK logo"
                  width={52}
                  height={52}
                  className="hidden dark:block select-none"
                  style={{ width: "auto", height: "auto" }}
                  priority
                />
                <Image
                  src="/logo_black.png"
                  alt="ROBOCEK logo"
                  width={52}
                  height={52}
                  className="block dark:hidden select-none"
                  style={{ width: "auto", height: "auto" }}
                  priority
                />
                <span
                  className="inline-flex items-center gap-2 rounded-full border
                  dark:border-zinc-700/70 dark:bg-zinc-900/60 dark:text-zinc-400
                  light:border-zinc-300 light:bg-zinc-100 light:text-zinc-700
                  px-4 py-1 text-xs font-medium tracking-[0.18em] uppercase"
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full
                    dark:bg-zinc-100 light:bg-zinc-800"
                  />
                  Robotics Club · GCE Kannur
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-semibold tracking-tight leading-tight">
                ROBOCEK
                <span className="block dark:text-zinc-400 light:text-zinc-600 text-xl sm:text-2xl lg:text-3xl mt-2 font-normal tracking-[0.25em] uppercase">
                  Robotics & Innovation Collective
                </span>
              </h1>

              <p className="max-w-xl text-sm sm:text-base dark:text-zinc-400 light:text-zinc-700 leading-relaxed">
                Official robotics club of Government College of Engineering
                Kannur — designing autonomous systems, intelligent machines and
                the engineers who build them.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                <a
                  href="#join"
                  className="group inline-flex items-center justify-center rounded-full border
                    dark:border-zinc-50 dark:bg-zinc-50 dark:text-black dark:hover:bg-black dark:hover:text-zinc-50 dark:hover:border-zinc-500
                    light:border-black light:bg-black light:text-white light:hover:bg-white light:hover:text-black light:hover:border-zinc-700
                    px-7 py-2.5 text-sm font-medium uppercase tracking-[0.18em] transition"
                >
                  Join the circuit
                  <span className="ml-2 h-px w-6 dark:bg-black light:bg-black group-hover:dark:bg-zinc-50 group-hover:light:bg-white transition-all group-hover:w-10" />
                </a>
                <a
                  href="#projects"
                  className="inline-flex items-center justify-center rounded-full border
                    dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-100 dark:hover:text-zinc-50
                    light:border-zinc-400 light:text-zinc-700 light:hover:border-zinc-800 light:hover:text-black
                    px-7 py-2.5 text-xs sm:text-sm font-medium uppercase tracking-[0.18em] transition"
                >
                  View projects
                </a>
              </div>

              <div
                className="mt-6 grid grid-cols-3 gap-4 text-xs sm:text-sm
                dark:text-zinc-400 light:text-zinc-700"
              >
                <div>
                  <p className="dark:text-zinc-200 light:text-black font-semibold">
                    Est. 2012
                  </p>
                  <p className="dark:text-zinc-500 light:text-zinc-600">
                    Continuously evolving lab culture
                  </p>
                </div>
                <div>
                  <p className="dark:text-zinc-200 light:text-black font-semibold">
                    Robotics
                  </p>
                  <p className="dark:text-zinc-500 light:text-zinc-600">
                    Autonomous, embedded & AI systems
                  </p>
                </div>
                <div>
                  <p className="dark:text-zinc-200 light:text-black font-semibold">
                    Community
                  </p>
                  <p className="dark:text-zinc-500 light:text-zinc-600">
                    Students · Mentors · Alumni
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Techy card */}
            <div className="flex-1 w-full max-w-md lg:max-w-lg">
              <div className="relative rounded-3xl border border-zinc-800 bg-linear-to-br from-zinc-900 via-black to-zinc-950 p-6 sm:p-8 shadow-[0_0_80px_rgba(255,255,255,0.05)] overflow-hidden">
                {/* glow */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen"
                  aria-hidden="true"
                >
                  <div className="absolute -inset-px bg-[radial-gradient(circle_at_top,white_0,transparent_60%)]" />
                </div>

                <div className="relative flex items-center justify-between mb-6 text-xs text-zinc-400">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Lab status · Online
                  </span>
                  <span className="tracking-[0.25em] uppercase">R0-8C3K</span>
                </div>

                <div className="relative flex flex-col gap-6">
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-[0.22em] text-zinc-500 mb-2">
                      Focus Areas
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-xs text-zinc-200">
                      <div className="rounded-xl border border-zinc-700/70 bg-zinc-900/60 px-3 py-2">
                        <p className="font-medium">Robotics</p>
                        <p className="text-[0.7rem] text-zinc-500 mt-1">
                          Line follower · Battle bot · Swarm
                        </p>
                      </div>
                      <div className="rounded-xl border border-zinc-700/70 bg-zinc-900/60 px-3 py-2">
                        <p className="font-medium">Embedded</p>
                        <p className="text-[0.7rem] text-zinc-500 mt-1">
                          Microcontrollers · ROS · Control
                        </p>
                      </div>
                      <div className="rounded-xl border border-zinc-700/70 bg-zinc-900/60 px-3 py-2">
                        <p className="font-medium">Computer Vision</p>
                        <p className="text-[0.7rem] text-zinc-500 mt-1">
                          Perception · Tracking
                        </p>
                      </div>
                      <div className="rounded-xl border border-zinc-700/70 bg-zinc-900/60 px-3 py-2">
                        <p className="font-medium">Autonomy</p>
                        <p className="text-[0.7rem] text-zinc-500 mt-1">
                          Navigation · Decision systems
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-zinc-800 pt-4 flex items-center justify-between text-[0.7rem] text-zinc-500">
                    <div className="flex flex-col gap-1">
                      <span className="uppercase tracking-[0.2em] text-zinc-400">
                        Campus
                      </span>
                      <span className="text-zinc-300">
                        Government College of Engineering Kannur
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="uppercase tracking-[0.2em] text-zinc-400">
                        Mode
                      </span>
                      <span className="text-zinc-300">
                        Build · Learn · Compete
                      </span>
                    </div>
                  </div>
                </div>

                {/* subtle grid */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.04]"
                  aria-hidden="true"
                >
                  <div className="h-full w-full bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-size-[32px_32px]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section
          id="projects"
          className="w-full border-t dark:border-zinc-900/80 light:border-zinc-300
            dark:bg-black/40 light:bg-gray-50 backdrop-blur-sm"
        >
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-16">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
                  What we build
                </h2>
                <p className="mt-2 text-sm dark:text-zinc-400 light:text-zinc-700 max-w-md">
                  From idea to track‑ready prototypes, ROBOCEK teams design,
                  fabricate and program robots that compete in college and
                  national‑level events.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-[0.68rem] uppercase tracking-[0.16em] dark:text-zinc-500 light:text-zinc-600">
                <span className="rounded-full border dark:border-zinc-700 light:border-zinc-400 px-3 py-1">
                  Hackathons
                </span>
                <span className="rounded-full border dark:border-zinc-700 light:border-zinc-400 px-3 py-1">
                  Robowars
                </span>
                <span className="rounded-full border dark:border-zinc-700 light:border-zinc-400 px-3 py-1">
                  Line Followers
                </span>
                <span className="rounded-full border dark:border-zinc-700 light:border-zinc-400 px-3 py-1">
                  Ideathons
                </span>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div className="group rounded-2xl border dark:border-zinc-800 light:border-zinc-300 dark:bg-zinc-950/40 light:bg-white p-5 hover:border-zinc-100 transition-colors">
                <p className="text-[0.68rem] uppercase tracking-[0.18em] dark:text-zinc-500 light:text-zinc-600 mb-2">
                  Autonomous Navigation
                </p>
                <h3 className="text-sm font-semibold mb-2 dark:text-zinc-50 light:text-black">
                  Line Follower & Maze Solvers
                </h3>
                <p className="text-xs dark:text-zinc-400 light:text-zinc-700 mb-3">
                  High‑speed bots tuned with PID, sensor fusion and optimized
                  path planning for complex tracks and mazes.
                </p>
                <p className="text-[0.65rem] dark:text-zinc-500 light:text-zinc-600">
                  Infrared · Encoders · Microcontrollers
                </p>
              </div>

              <div className="group rounded-2xl border dark:border-zinc-800 light:border-zinc-300 dark:bg-zinc-950/40 light:bg-white p-5 hover:border-zinc-100 transition-colors">
                <p className="text-[0.68rem] uppercase tracking-[0.18em] dark:text-zinc-500 light:text-zinc-600 mb-2">
                  Competitive Robotics
                </p>
                <h3 className="text-sm font-semibold mb-2 dark:text-zinc-50 light:text-black">
                  Battle & Task‑Based Bots
                </h3>
                <p className="text-xs dark:text-zinc-400 light:text-zinc-700 mb-3">
                  Mechanically robust bots with torque‑heavy drivetrains and
                  precise remote control systems for arena competitions.
                </p>
                <p className="text-[0.65rem] dark:text-zinc-500 light:text-zinc-600">
                  CAD · Fabrication · Powertrain
                </p>
              </div>

              <div className="group rounded-2xl border dark:border-zinc-800 light:border-zinc-300 dark:bg-zinc-950/40 light:bg-white p-5 hover:border-zinc-100 transition-colors">
                <p className="text-[0.68rem] uppercase tracking-[0.18em] dark:text-zinc-500 light:text-zinc-600 mb-2">
                  Research & Experiments
                </p>
                <h3 className="text-sm font-semibold mb-2 dark:text-zinc-50 light:text-black">
                  Vision & Automation
                </h3>
                <p className="text-xs dark:text-zinc-400 light:text-zinc-700 mb-3">
                  Mini‑projects that explore computer vision, embedded AI and
                  semi‑autonomous systems under senior guidance.
                </p>
                <p className="text-[0.65rem] dark:text-zinc-500 light:text-zinc-600">
                  Python · OpenCV · Control
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TEAM */}
        <section className="w-full border-t dark:border-zinc-900 light:border-zinc-300 dark:bg-black/60 light:bg-gray-50">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-16 flex flex-col lg:flex-row gap-10 items-stretch">
            <div className="flex-1 flex flex-col gap-3 justify-center">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
                The team behind the bots.
              </h2>
              <p className="text-sm dark:text-zinc-400 light:text-zinc-700 max-w-md">
                ROBOCEK is a mix of makers, coders, designers and mentors from
                across branches at Government College of Engineering Kannur —
                collaborating on robots, research and competitions.
              </p>
              <p className="text-xs dark:text-zinc-500 light:text-zinc-600 max-w-md">
                Visit the lab during club hours to meet the current core team,
                explore ongoing builds and see how you can contribute.
              </p>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-full max-w-xl rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950/60 shadow-[0_0_60px_rgba(255,255,255,0.04)]">
                <Image
                  src="/IMG-20260329-WA0028.jpg"
                  alt="ROBOCEK team group photo"
                  width={1200}
                  height={800}
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[0.7rem] text-zinc-200">
                  <span className="uppercase tracking-[0.18em] text-zinc-300">
                    ROBOCEK · Team
                  </span>
                  <span className="text-zinc-400">
                    Group photo · {new Date().getFullYear()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* JOIN */}
        <section
          id="join"
          className="w-full border-t dark:border-zinc-900 light:border-zinc-300
            dark:bg-black light:bg-white py-12 sm:py-16"
        >
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 flex flex-col lg:flex-row gap-10 items-start">
            <div className="flex-1 flex flex-col gap-4">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
                Plug into the ROBOCEK network.
              </h2>
              <p className="text-sm dark:text-zinc-400 light:text-zinc-700 max-w-xl">
                Whether you are just starting with electronics or already
                prototyping complex systems, there is a squad for you. We host
                workshops, build sessions, late‑night debugging and competition
                teams through the year.
              </p>
              <div className="grid gap-4 sm:grid-cols-3 text-xs dark:text-zinc-300 light:text-zinc-700">
                <div className="border dark:border-zinc-800 light:border-zinc-300 rounded-xl p-3 dark:bg-zinc-950/40 light:bg-white">
                  <p className="font-semibold mb-1">Foundation</p>
                  <p className="dark:text-zinc-500 light:text-zinc-600">
                    Basics of electronics, sensors, microcontrollers and CAD.
                  </p>
                </div>
                <div className="border dark:border-zinc-800 light:border-zinc-300 rounded-xl p-3 dark:bg-zinc-950/40 light:bg-white">
                  <p className="font-semibold mb-1">Build</p>
                  <p className="dark:text-zinc-500 light:text-zinc-600">
                    Focused project teams for college events and expos.
                  </p>
                </div>
                <div className="border dark:border-zinc-800 light:border-zinc-300 rounded-xl p-3 dark:bg-zinc-950/40 light:bg-white">
                  <p className="font-semibold mb-1">Research</p>
                  <p className="dark:text-zinc-500 light:text-zinc-600">
                    Experiments with autonomy, AI integration and advanced
                    control.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full max-w-md self-stretch">
              <div className="relative border dark:border-zinc-800 light:border-zinc-300 rounded-2xl dark:bg-zinc-950/60 light:bg-white p-5 sm:p-6">
                <p className="text-[0.7rem] uppercase tracking-[0.18em] dark:text-zinc-500 light:text-zinc-600 mb-3">
                  Register Interest
                </p>
                <p className="text-xs dark:text-zinc-400 light:text-zinc-700 mb-4">
                  Official registrations happen via department notices and
                  campus drives. Share your mail and branch so we can notify you
                  about upcoming sessions.
                </p>

                <form className="flex flex-col gap-3 text-xs">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[0.7rem] uppercase tracking-[0.16em] dark:text-zinc-500 light:text-zinc-600">
                      College email
                    </label>
                    <input
                      type="email"
                      placeholder="you@gcek.ac.in"
                      className="h-9 rounded-full border
                        dark:border-zinc-800 dark:bg-black dark:text-zinc-100 dark:placeholder:text-zinc-600
                        light:border-zinc-300 light:bg-white light:text-black light:placeholder:text-zinc-500
                        px-3 text-xs focus:outline-none focus:ring-1
                        dark:focus:ring-zinc-400 dark:focus:border-zinc-400
                        light:focus:ring-zinc-600 light:focus:border-zinc-600"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[0.7rem] uppercase tracking-[0.16em] dark:text-zinc-500 light:text-zinc-600">
                      Branch / Year
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ECE · S3"
                      className="h-9 rounded-full border
                        dark:border-zinc-800 dark:bg-black dark:text-zinc-100 dark:placeholder:text-zinc-600
                        light:border-zinc-300 light:bg-white light:text-black light:placeholder:text-zinc-500
                        px-3 text-xs focus:outline-none focus:ring-1
                        dark:focus:ring-zinc-400 dark:focus:border-zinc-400
                        light:focus:ring-zinc-600 light:focus:border-zinc-600"
                    />
                  </div>

                  <button
                    type="button"
                    className="mt-2 inline-flex items-center justify-center rounded-full dark:bg-zinc-50 light:bg-black px-6 py-2 text-[0.7rem] font-medium uppercase tracking-[0.2em] dark:text-black light:text-white dark:hover:bg-zinc-200 light:hover:bg-zinc-900 transition"
                  >
                    Coming soon
                  </button>
                </form>

                <p className="mt-4 text-[0.65rem] dark:text-zinc-600 light:text-zinc-500">
                  For collaborations or event invites, contact us through the
                  staff coordinator or official GCEK communication channels.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t dark:border-zinc-900 light:border-zinc-300 dark:bg-black/95 light:bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[0.7rem] dark:text-zinc-500 light:text-zinc-600">
          <p>
            © {new Date().getFullYear()} ROBOCEK · Robotics Club, Government
            College of Engineering Kannur.
          </p>
          <div className="flex items-center gap-4">
            <span className="uppercase tracking-[0.18em] dark:text-zinc-600 light:text-zinc-500">
              Designed in B/W
            </span>
            <span className="h-px w-10 dark:bg-zinc-700 light:bg-zinc-300" />
            <a
              href="#top"
              className="dark:hover:text-zinc-200 light:hover:text-zinc-800 transition uppercase tracking-[0.16em]"
            >
              Top
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
