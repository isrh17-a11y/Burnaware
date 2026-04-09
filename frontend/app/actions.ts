'use server'

import prisma from '@/lib/prisma'
import { encryptText, decryptText } from '@/lib/encryption'

export async function submitBurnoutAssessment(data: {
  userId: string,
  userEmail?: string,
  userName?: string,
  exhaustionScore: number,
  cynicismScore: number,
  professionalEfficacy: number,
  phq4Score: number
}) {
  try {
    // Ensure User exists in this DB to satisfy foreign keys
    await prisma.user.upsert({
      where: { id: data.userId },
      update: {},
      create: {
        id: data.userId,
        email: data.userEmail || `${data.userId}@example.com`,
        username: data.userName || data.userId,
      }
    })

    const assessment = await prisma.burnoutAssessment.create({
      data: {
        userId: data.userId,
        exhaustionScore: data.exhaustionScore,
        cynicismScore: data.cynicismScore,
        professionalEfficacy: data.professionalEfficacy,
        phq4Score: data.phq4Score
      }
    })
    return { success: true, assessment }
  } catch (error) {
    console.error("Error saving assessment:", error)
    return { success: false, error: "Failed to save assessment" }
  }
}

export async function submitJournalEntry(data: {
  userId: string,
  userEmail?: string,
  userName?: string,
  emotionTag: string,
  triggerCategory: string,
  content: string
}) {
  try {
    // Ensure User exists in this DB to satisfy foreign keys
    await prisma.user.upsert({
      where: { id: data.userId },
      update: {},
      create: {
        id: data.userId,
        email: data.userEmail || `${data.userId}@example.com`,
        username: data.userName || data.userId,
      }
    })

    const encryptedContent = encryptText(data.content);

    const journal = await prisma.journalEntry.create({
      data: {
        userId: data.userId,
        emotionTag: data.emotionTag,
        triggerCategory: data.triggerCategory,
        content: encryptedContent
      }
    })
    return { success: true, journal }
  } catch (error) {
    console.error("Error saving journal:", error)
    return { success: false, error: "Failed to save journal" }
  }
}

export async function getJournalEntries(userId: string) {
  try {
    const entries = await prisma.journalEntry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    const decryptedEntries = entries.map((entry: any) => ({
      ...entry,
      content: decryptText(entry.content)
    }));

    return { success: true, entries: decryptedEntries }
  } catch (error) {
    console.error("Error fetching journals:", error)
    return { success: false, error: "Failed to fetch journals" }
  }
}
