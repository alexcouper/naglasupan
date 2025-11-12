'use client'

import React from 'react'
import Link from 'next/link'
import { Trophy, Code2, Users, Award, ArrowRight, Target, Lightbulb, Zap, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Home() {
  const { t, isLoaded } = useLanguage()

  // Show loading while translations are loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Code2 className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium border-2 border-amber-200">
              <Trophy className="w-4 h-4" />
              <span>{t('home.hero.badge')}</span>
            </div>
          </div>

          <h1 className="text-5xl sm:text-7xl font-bold text-gray-900 mb-6">
            {t('home.hero.title')}
            <span className="block text-blue-600">{t('home.hero.titleHighlight')}</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            {t('home.hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/submit">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                {t('home.hero.submitProject')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="#monthly-prize">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 border-2">
                <Trophy className="w-5 h-5 mr-2" />
                {t('home.hero.viewMonthlyPrize')}
              </Button>
            </Link>
          </div>
        </div>
      </section>



      {/* Value Props Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('home.valueProps.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('home.valueProps.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center border-2 hover:border-blue-400 transition-all hover:shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {t('home.valueProps.visibility.title')}
                </h3>
                <p className="text-gray-600 text-lg">
                  {t('home.valueProps.visibility.description')}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-blue-400 transition-all hover:shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {t('home.valueProps.connect.title')}
                </h3>
                <p className="text-gray-600 text-lg">
                  {t('home.valueProps.connect.description')}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-blue-400 transition-all hover:shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {t('home.valueProps.impact.title')}
                </h3>
                <p className="text-gray-600 text-lg">
                  {t('home.valueProps.impact.description')}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-lg p-8 text-center">
            <Trophy className="w-12 h-12 text-amber-600 mx-auto mb-4" />
            <p className="text-xl text-gray-800 font-medium max-w-3xl mx-auto">
              {t('home.valueProps.prizeCallout')}
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('home.howItWorks.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('home.howItWorks.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('home.howItWorks.step1.title')}
              </h3>
              <p className="text-gray-600">
                {t('home.howItWorks.step1.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('home.howItWorks.step2.title')}
              </h3>
              <p className="text-gray-600">
                {t('home.howItWorks.step2.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('home.howItWorks.step3.title')}
              </h3>
              <p className="text-gray-600">
                {t('home.howItWorks.step3.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-amber-600">4</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('home.howItWorks.step4.title')}
              </h3>
              <p className="text-gray-600">
                {t('home.howItWorks.step4.description')}
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/submit">
              <Button size="lg" className="text-lg px-8">
                {t('home.hero.submitProject')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Monthly Prize Section */}
      <section id="monthly-prize" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-yellow-400 to-amber-500 p-4 rounded-full">
                <Trophy className="w-12 h-12 text-white" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('home.monthlyPrize.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('home.monthlyPrize.subtitle')}
            </p>
          </div>

          <Card className="border-4 border-amber-200 bg-white shadow-2xl">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-12 mb-8">
                <div className="bg-white rounded-lg p-8 border-2 border-dashed border-gray-300">
                  <Code2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {t('home.monthlyPrize.placeholderTitle')}
                  </h3>
                  <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
                    {t('home.monthlyPrize.placeholderDescription')}
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-blue-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">{t('home.monthlyPrize.comingSoon')}</span>
                  </div>
                </div>
              </div>

              <Link href="/submit">
                <Button size="lg" className="text-lg px-8 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600">
                  <Trophy className="w-5 h-5 mr-2" />
                  {t('home.monthlyPrize.submitToCompete')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            {t('home.cta.title')}
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            {t('home.cta.subtitle')}
          </p>
          <Link href="/submit">
            <Button variant="secondary" size="lg" className="text-lg px-8">
              {t('home.cta.button')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
            {t('home.mission.title')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="border-2 hover:border-blue-300 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 rounded-lg p-3 flex-shrink-0">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {t('home.mission.problem1.title')}
                    </h3>
                    <p className="text-gray-600">
                      {t('home.mission.problem1.description')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-300 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 rounded-lg p-3 flex-shrink-0">
                    <Lightbulb className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {t('home.mission.problem2.title')}
                    </h3>
                    <p className="text-gray-600">
                      {t('home.mission.problem2.description')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-300 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 rounded-lg p-3 flex-shrink-0">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {t('home.mission.problem3.title')}
                    </h3>
                    <p className="text-gray-600">
                      {t('home.mission.problem3.description')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-300 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-amber-100 rounded-lg p-3 flex-shrink-0">
                    <Target className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {t('home.mission.problem4.title')}
                    </h3>
                    <p className="text-gray-600">
                      {t('home.mission.problem4.description')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <p className="text-xl text-gray-700 max-w-4xl mx-auto font-medium">
              {t('home.mission.value')}
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}
