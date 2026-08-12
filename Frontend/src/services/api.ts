// React Frontend API Integration Service with Laravel Backend & Fallback

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export interface StatItem {
  id?: number;
  label: string;
  value: string;
  suffix: string;
}

export interface HeroSlideItem {
  id?: number;
  category: string;
  title: string;
  badge_title?: string;
  badgeTitle?: string;
  badge_sub?: string;
  badgeSub?: string;
  tags: string[];
  url: string;
}

export interface AchievementItem {
  id?: number;
  event: string;
  result: string;
  tier: "gold" | "silver" | "bronze";
  year: string;
  icon: string;
}

export interface GalleryItemData {
  id?: number;
  url: string;
  alt: string;
  tall: boolean;
}

export interface TeacherItem {
  id?: number;
  name: string;
  role: string;
  initials: string;
  color: string;
}

export interface TestimonialItem {
  id?: number;
  name: string;
  role: string;
  quote: string;
  year: string;
  initials: string;
}

export interface ContactPayload {
  name: string;
  email?: string;
  phone?: string;
  message: string;
}

/**
 * Fetch dynamic content from Laravel API with fallback logic
 */
export async function fetchPublicContent() {
  // Abort after 3 seconds to fail fast and use local fallback
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);

  try {
    const response = await fetch(`${API_BASE_URL}/content`, {
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`);
    }

    const result = await response.json();
    if (result.status === 'success' && result.data) {
      return {
        success: true,
        data: result.data,
      };
    }
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn('[API Service] Laravel API unreachable, using static fallback:', error);
  }

  return {
    success: false,
    data: null,
  };
}

/**
 * Send contact / PPDB registration to Laravel backend MySQL
 */
export async function submitContactMessage(payload: ContactPayload) {
  try {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (response.ok) {
      return {
        success: true,
        message: result.message || 'Pesan berhasil tersimpan di database MySQL Laragon!',
        data: result.data,
      };
    } else {
      return {
        success: false,
        message: result.message || 'Gagal menyimpan pesan ke database.',
      };
    }
  } catch (error) {
    console.error('[API Service] Error submitting message to Laravel backend:', error);
    return {
      success: false,
      message: 'Tidak dapat terhubung ke server database Laravel. Mohon pastikan Laragon & server Laravel aktif.',
    };
  }
}
