'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'motion/react'
import { UserIcon, BriefcaseIcon, CogIcon, CheckIcon } from '@heroicons/react/24/outline'
import { updateUserName, updateUserProfile, updateUserPreferences } from '@/app/actions/account'
import type { UserPreferences } from '@/db/schema'
import { industryOptions } from '@/lib/validations/onboarding'

type UserData = {
  id: string
  name: string | null
  email: string
  image: string | null
  profile: {
    phone: string
    jobTitle: string
    company: string
    industry: string
    preferences: UserPreferences | null
  } | null
  subscription: {
    plan: string
    status: string
  } | null
}

export default function AccountPageContent({ user }: { user: UserData }) {
  const [activeTab, setActiveTab] = useState<'personal' | 'professional' | 'preferences'>('personal')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Estados para formulários
  const [name, setName] = useState(user.name || '')
  const [phone, setPhone] = useState(user.profile?.phone || '')
  const [jobTitle, setJobTitle] = useState(user.profile?.jobTitle || '')
  const [company, setCompany] = useState(user.profile?.company || '')
  const [industry, setIndustry] = useState(user.profile?.industry || '')
  const [preferences, setPreferences] = useState<UserPreferences>(
    user.profile?.preferences || {
      theme: 'system',
      emailNotifications: true,
      marketingEmails: false,
    }
  )

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const result = await updateUserName({ name })
    setIsLoading(false)
    showMessage(result.success ? 'success' : 'error', result.message)
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const result = await updateUserProfile({ phone, jobTitle, company, industry })
    setIsLoading(false)
    showMessage(result.success ? 'success' : 'error', result.message)
  }

  const handleUpdatePreferences = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const result = await updateUserPreferences(preferences)
    setIsLoading(false)
    showMessage(result.success ? 'success' : 'error', result.message)
  }

  const tabs = [
    { id: 'personal' as const, label: 'Pessoal', icon: UserIcon },
    { id: 'professional' as const, label: 'Profissional', icon: BriefcaseIcon },
    { id: 'preferences' as const, label: 'Preferências', icon: CogIcon },
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-foreground">Minha Conta</h1>
        <p className="text-muted-foreground mt-2">Gerencie suas informações e preferências</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-xl border border-border p-6 mb-6"
      >
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500">
            {user.image ? (
              <Image src={user.image} alt={user.name || 'User'} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">{user.name || 'Usuário'}</h2>
            <p className="text-muted-foreground">{user.email}</p>
            <span className={`inline-block mt-2 text-xs font-medium px-2 py-1 rounded-full text-white ${
              user.subscription?.plan === 'max' ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
              user.subscription?.plan === 'pro' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
              'bg-zinc-500'
            }`}>
              Plano {user.subscription?.plan?.toUpperCase() || 'FREE'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Message Toast */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`mb-4 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
          }`}
        >
          {message.text}
        </motion.div>
      )}

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-xl border border-border overflow-hidden"
      >
        <div className="flex border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Tab: Pessoal */}
          {activeTab === 'personal' && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleUpdateName}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nome</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-3 rounded-lg border border-border bg-muted text-muted-foreground cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground mt-1">O email não pode ser alterado pois está vinculado à sua conta OAuth.</p>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isLoading ? 'Salvando...' : 'Salvar Nome'}
              </button>
            </motion.form>
          )}

          {/* Tab: Profissional */}
          {activeTab === 'professional' && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleUpdateProfile}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Telefone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(00) 00000-0000"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Cargo</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Empresa</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Setor</label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Selecione...</option>
                    {industryOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isLoading ? 'Salvando...' : 'Salvar Dados Profissionais'}
              </button>
            </motion.form>
          )}

          {/* Tab: Preferências */}
          {activeTab === 'preferences' && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleUpdatePreferences}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Tema</label>
                <div className="flex gap-3">
                  {(['light', 'dark', 'system'] as const).map((theme) => (
                    <button
                      key={theme}
                      type="button"
                      onClick={() => setPreferences({ ...preferences, theme })}
                      className={`flex-1 py-3 px-4 rounded-lg border transition-colors ${
                        preferences.theme === theme
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-600'
                          : 'border-border hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {preferences.theme === theme && <CheckIcon className="w-4 h-4" />}
                        <span className="capitalize">{theme === 'system' ? 'Sistema' : theme === 'light' ? 'Claro' : 'Escuro'}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                  <div>
                    <span className="font-medium text-foreground">Notificações por email</span>
                    <p className="text-sm text-muted-foreground">Receba atualizações sobre sua conta</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.emailNotifications}
                    onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
                    className="w-5 h-5 rounded border-border text-purple-600 focus:ring-purple-500"
                  />
                </label>

                <label className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                  <div>
                    <span className="font-medium text-foreground">Emails de marketing</span>
                    <p className="text-sm text-muted-foreground">Novidades, dicas e ofertas especiais</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.marketingEmails}
                    onChange={(e) => setPreferences({ ...preferences, marketingEmails: e.target.checked })}
                    className="w-5 h-5 rounded border-border text-purple-600 focus:ring-purple-500"
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isLoading ? 'Salvando...' : 'Salvar Preferências'}
              </button>
            </motion.form>
          )}
        </div>
      </motion.div>
    </div>
  )
}
