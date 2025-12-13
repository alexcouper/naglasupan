'use client'

import React from 'react'
import Link from 'next/link'
import {
  Code2, ArrowRight, Terminal, Wrench, Construction,
  Zap, Rocket, Binary, Cpu, Globe,
  Sparkles, Heart, Sun, PartyPopper, Lightbulb
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'

// ============================================
// Theme 1: Work in Progress
// Terminal-like, under construction, honest
// ============================================

// Status items configuration
const statusItems = [
  { label: 'Basic project submission', completed: true, inProgress: false },
  { label: 'Weekly prizes (starting January 2026)', completed: true, inProgress: false },
  { label: 'Project listing', completed: false, inProgress: true },
  { label: 'Make the site Icelandic first', completed: false, inProgress: false },
  { label: 'User profiles', completed: false, inProgress: false },
  { label: 'Voting system', completed: false, inProgress: false },

]

function WIPHome() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#a3a3a3] font-mono">
      {/* Hero */}
      <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 border-b border-[#333]">
        <div className="max-w-4xl mx-auto">
          {/* Terminal header */}
          <div className="flex items-center gap-2 mb-6 text-[#22c55e] text-sm">
            <Terminal className="w-4 h-4" />
            <span>krí1.is v0.1.0-alpha</span>
            <span className="animate-blink">_</span>
          </div>

          {/* Status badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 border border-[#fbbf24] bg-[#fbbf24]/10 text-[#fbbf24] text-xs">
            <Construction className="w-3 h-3" />
            <span>UNDER ACTIVE DEVELOPMENT</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold text-[#e5e5e5] mb-6 leading-tight">
            A place for Icelandic
            <br />
            side projects
          </h1>

          <p className="text-lg text-[#737373] mb-8 max-w-2xl leading-relaxed">
            We&apos;re building something new. Submit your project, get it listed, maybe win a prize eventually.
            It&apos;s early days — expect rough edges.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/submit">
              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-[#22c55e] text-[#0d0d0d] font-bold text-sm hover:bg-[#16a34a] transition-colors w-full sm:w-auto">
                <Wrench className="w-4 h-4" />
                SUBMIT PROJECT
              </button>
            </Link>
            <Link href="/projects">
              <button className="flex items-center justify-center gap-2 px-6 py-3 border border-[#333] text-[#a3a3a3] font-bold text-sm hover:border-[#22c55e] hover:text-[#22c55e] transition-colors w-full sm:w-auto">
                VIEW PROJECTS
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* What this is */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-[#333]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-[#22c55e] text-sm mb-6">
            <span className="text-[#525252]">$</span> cat README.md
          </div>

          <div className="space-y-6 text-[#a3a3a3]">
            <div className="border-l-2 border-[#333] pl-4">
              <h2 className="text-xl font-bold text-[#e5e5e5] mb-2"># What is this?</h2>
              <p>A directory of side projects built by people in Iceland. That&apos;s it.</p>
            </div>

            <div className="border-l-2 border-[#333] pl-4">
              <h2 className="text-xl font-bold text-[#e5e5e5] mb-2"># Current status</h2>
              <ul className="space-y-1 text-sm">
                {statusItems.map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className={item.completed ? "text-[#22c55e]" : item.inProgress ? "text-[#3b82f6]" : "text-[#fbbf24]"}>
                      {item.completed ? '[x]' : item.inProgress ? '[~]' : '[ ]'}
                    </span>
                    {item.label}
                    {item.inProgress && <span className="text-[#3b82f6] text-xs">[IN PROGRESS]</span>}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-l-2 border-[#333] pl-4">
              <h2 className="text-xl font-bold text-[#e5e5e5] mb-2"># Why?</h2>
              <p>
                Iceland has a lot of builders making interesting things.
                This is an attempt to encourage them to continue, to make them more visible, and to give decent feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-[#333]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-[#22c55e] text-sm mb-6">
            <span className="text-[#525252]">$</span> ./submit.sh --help
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border border-[#333] bg-[#171717]">
              <div className="text-[#22c55e] text-xs mb-2">STEP 01</div>
              <h3 className="text-[#e5e5e5] font-bold mb-2">Submit a URL</h3>
              <p className="text-sm text-[#737373]">
                Drop your project URL. Add some context if you want.
              </p>
            </div>

            <div className="p-4 border border-[#333] bg-[#171717]">
              <div className="text-[#22c55e] text-xs mb-2">STEP 02</div>
              <h3 className="text-[#e5e5e5] font-bold mb-2">We review it</h3>
              <p className="text-sm text-[#737373]">
                Manual review. Takes a bit. We&apos;ll add details and tags.
              </p>
            </div>

            <div className="p-4 border border-[#333] bg-[#171717]">
              <div className="text-[#22c55e] text-xs mb-2">STEP 03</div>
              <h3 className="text-[#e5e5e5] font-bold mb-2">Goes live</h3>
              <p className="text-sm text-[#737373]">
                Your project joins the directory. That&apos;s the deal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-[#525252] text-sm mb-4">
            {`// made in iceland`}
          </div>
          <p className="text-[#737373] mb-6">
            Got a side project? Share it.
          </p>
          <Link href="/submit">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-[#22c55e] text-[#0d0d0d] font-bold text-sm hover:bg-[#16a34a] transition-colors">
              SUBMIT PROJECT
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </section>
    </div>
  )
}

// ============================================
// Theme 2: Futuristic / Edgy / Coder
// Cyberpunk, neon, high-tech
// ============================================
function FuturisticHome() {
  return (
    <div className="min-h-screen bg-[#030712] text-[#94a3b8] overflow-hidden">
      {/* Hero with grid background */}
      <section className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />

        {/* Gradient orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Glowing badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-cyan-500/50 bg-cyan-500/10 text-cyan-400 text-sm animate-pulse-glow">
            <Zap className="w-4 h-4" />
            <span>ICELAND&apos;S PROJECT HUB</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 mb-6 leading-tight">
            BUILD.
            <br />
            SHIP.
            <br />
            DOMINATE.
          </h1>

          <p className="text-xl text-[#64748b] max-w-2xl mx-auto mb-10 leading-relaxed">
            The launchpad for Iceland&apos;s most ambitious builders.
            Submit your project. Get discovered. Win prizes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/submit">
              <button className="group flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 w-full sm:w-auto">
                <Rocket className="w-5 h-5 group-hover:animate-bounce" />
                LAUNCH PROJECT
              </button>
            </Link>
            <Link href="/projects">
              <button className="flex items-center justify-center gap-2 px-8 py-4 rounded-lg border-2 border-purple-500/50 text-purple-400 font-bold text-lg hover:bg-purple-500/10 hover:border-purple-400 transition-all w-full sm:w-auto">
                <Binary className="w-5 h-5" />
                EXPLORE
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#1e293b]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              WHY BUILDERS CHOOSE US
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-xl bg-[#0f172a] border border-[#1e293b] hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Cpu className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">MAXIMUM EXPOSURE</h3>
              <p className="text-[#64748b]">
                Your project, front and center. Get seen by Iceland&apos;s tech scene.
              </p>
            </div>

            <div className="group p-8 rounded-xl bg-[#0f172a] border border-[#1e293b] hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/10">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">COMPETE & WIN</h3>
              <p className="text-[#64748b]">
                Monthly prizes for top projects. Build something legendary.
              </p>
            </div>

            <div className="group p-8 rounded-xl bg-[#0f172a] border border-[#1e293b] hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">NETWORK EFFECT</h3>
              <p className="text-[#64748b]">
                Connect with collaborators. Find your next co-founder.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#1e293b]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              THE PROTOCOL
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto" />
          </div>

          <div className="relative">
            {/* Connection line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500 via-purple-500 to-blue-500 hidden md:block" />

            <div className="space-y-12">
              {[
                { num: '01', title: 'SUBMIT', desc: 'Drop your project URL into the system', icon: <Terminal className="w-6 h-6" /> },
                { num: '02', title: 'PROCESS', desc: 'We review, tag, and optimize your listing', icon: <Cpu className="w-6 h-6" /> },
                { num: '03', title: 'DEPLOY', desc: 'Your project goes live to the network', icon: <Rocket className="w-6 h-6" /> },
              ].map((step, i) => (
                <div key={step.num} className={`flex items-center gap-8 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  <div className={`flex-1 ${i % 2 === 1 ? 'md:text-right' : ''}`}>
                    <div className="inline-flex items-center gap-2 text-cyan-400 text-sm mb-2">
                      {step.icon}
                      <span>STEP {step.num}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-[#64748b]">{step.desc}</p>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 hidden md:block" />
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#1e293b]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
            READY TO SHIP?
          </h2>
          <p className="text-xl text-[#64748b] mb-10">
            Your next project could be the one that changes everything.
          </p>
          <Link href="/submit">
            <button className="inline-flex items-center gap-3 px-10 py-5 rounded-xl bg-gradient-to-r from-purple-500 via-cyan-500 to-blue-500 text-white font-bold text-xl hover:opacity-90 transition-opacity shadow-2xl shadow-purple-500/25">
              <Rocket className="w-6 h-6" />
              INITIATE LAUNCH
            </button>
          </Link>
        </div>
      </section>
    </div>
  )
}

// ============================================
// Theme 3: Bright / Hopeful / Energetic
// Warm colors, playful, optimistic
// ============================================
function BrightHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      {/* Hero */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          {/* Playful badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-gradient-to-r from-orange-100 to-pink-100 text-orange-600 text-sm font-medium border border-orange-200">
            <Sparkles className="w-4 h-4" />
            <span>Made in Iceland with love</span>
            <Heart className="w-4 h-4 text-pink-500" />
          </div>

          <h1 className="text-5xl sm:text-7xl font-black text-gray-900 mb-6 leading-tight">
            Share what you&apos;re
            <span className="block bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              building!
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Iceland&apos;s happiest corner for side projects. Show off your work,
            discover cool stuff, and maybe win something nice!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/submit">
              <button className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold text-lg hover:from-orange-400 hover:to-pink-400 transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-1 w-full sm:w-auto">
                <PartyPopper className="w-5 h-5" />
                Share Your Project
              </button>
            </Link>
            <Link href="/projects">
              <button className="flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-purple-300 text-purple-600 font-bold text-lg hover:bg-purple-50 hover:border-purple-400 transition-all w-full sm:w-auto">
                <Lightbulb className="w-5 h-5" />
                Explore Projects
              </button>
            </Link>
          </div>

          {/* Fun floating elements */}
          <div className="relative h-32 mt-12">
            <div className="absolute left-1/4 animate-float">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center shadow-lg">
                <Code2 className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 animate-float" style={{ animationDelay: '0.5s' }}>
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center shadow-lg">
                <Rocket className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="absolute right-1/4 animate-float" style={{ animationDelay: '1s' }}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-400 flex items-center justify-center shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              It&apos;s super easy!
            </h2>
            <p className="text-lg text-gray-600">Three simple steps to share your creation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: '1', title: 'Submit', desc: 'Just paste your project URL and tell us a bit about it', color: 'from-orange-400 to-yellow-400', icon: <Terminal className="w-6 h-6" /> },
              { num: '2', title: 'Review', desc: 'We take a look and add it to our lovely collection', color: 'from-pink-400 to-rose-400', icon: <Heart className="w-6 h-6" /> },
              { num: '3', title: 'Celebrate!', desc: 'Your project is live! Time to share the good news', color: 'from-purple-400 to-indigo-400', icon: <PartyPopper className="w-6 h-6" /> },
            ].map((step) => (
              <div key={step.num} className="text-center group">
                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <span className="text-3xl font-black text-white">{step.num}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why share your project?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-orange-100">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center mb-6">
                <Sun className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Get discovered</h3>
              <p className="text-gray-600">
                Let people find your awesome work! We&apos;ll help spread the word.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-pink-100">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Inspire others</h3>
              <p className="text-gray-600">
                Your project might spark someone else&apos;s next big idea!
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-purple-100">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-indigo-400 flex items-center justify-center mb-6">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Win prizes</h3>
              <p className="text-gray-600">
                Monthly prizes for standout projects. Yours could be next!
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-cyan-100">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-400 flex items-center justify-center mb-6">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Build Iceland</h3>
              <p className="text-gray-600">
                Be part of Iceland&apos;s growing maker scene!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
            Ready to share?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            We can&apos;t wait to see what you&apos;ve been working on!
          </p>
          <Link href="/submit">
            <button className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-white text-purple-600 font-bold text-xl hover:bg-purple-50 transition-all shadow-2xl hover:-translate-y-1">
              <PartyPopper className="w-6 h-6" />
              Let&apos;s Go!
            </button>
          </Link>
        </div>
      </section>
    </div>
  )
}

// ============================================
// Main Page Component
// ============================================
export default function Home() {
  const { isLoaded } = useLanguage()
  const { theme } = useTheme()

  // Show loading while translations are loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <Code2 className="w-12 h-12 text-[var(--accent,#22c55e)] mx-auto mb-4 animate-spin" />
          <p className="text-[var(--text-secondary,#737373)]">Loading...</p>
        </div>
      </div>
    )
  }

  switch (theme) {
    case 'wip':
      return <WIPHome />
    case 'futuristic':
      return <FuturisticHome />
    case 'bright':
      return <BrightHome />
    default:
      return <WIPHome />
  }
}
