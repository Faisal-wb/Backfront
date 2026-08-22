// React Frontend API Integration Service with Laravel Backend & Fallback

export const API_BASE_URL = 'https://lt3tjkt.smkthpati.sch.id/api';

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
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
      cache: 'no-store',
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


/**
 * Authenticate Admin Login via Laravel Backend API
 */
export async function adminLogin(username: string, password: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();

    if (response.ok && result.status === 'success') {
      // Save token to localStorage
      if (result.token) {
        localStorage.setItem('tjkt_admin_token', result.token);
      }
      return {
        success: true,
        message: result.message || 'Login berhasil!',
        user: result.user,
      };
    } else {
      return {
        success: false,
        message: result.message || 'Username atau password salah!',
      };
    }
  } catch (error) {
    console.error('[API Service] Error connecting to Laravel backend:', error);
    return {
      success: false,
      message: 'Tidak dapat terhubung ke server database Backend Laravel. Mohon pastikan Laragon / server Laravel aktif!',
    };
  }
}

/**
 * Admin Logout via Laravel Backend API
 */
export async function adminLogout() {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/logout`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
    });
    const result = await response.json();

    // Clear token
    localStorage.removeItem('tjkt_admin_token');

    return {
      success: response.ok,
      message: result.message || 'Logout berhasil!',
    };
  } catch (error) {
    localStorage.removeItem('tjkt_admin_token');
    return {
      success: true,
      message: 'Logout berhasil (lokal)',
    };
  }
}

/**
 * Fetch dynamic Site Content Data from Laravel API
 */
export async function fetchSiteContentApi() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);

  try {
    const response = await fetch(`${API_BASE_URL}/site-content`, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
      cache: 'no-store',
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
    console.warn('[API Service] Failed to fetch site content from backend:', error);
  }

  return {
    success: false,
    data: null,
  };
}

/**
 * Save Site Content Data to Laravel API
 */
export async function saveSiteContentApi(data: any) {
  try {
    const token = localStorage.getItem('tjkt_admin_token');
    const headers: any = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    const options: RequestInit = {
      method: 'POST',
      headers,
    };

    if (data instanceof FormData) {
      options.body = data;
    } else {
      headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}/site-content`, options);

    const result = await response.json();

    if (response.ok && result.status === 'success') {
      return {
        success: true,
        message: result.message || 'Berhasil menyimpan pengaturan!',
        data: result.data
      };
    } else {
      return {
        success: false,
        message: result.message || 'Gagal menyimpan pengaturan.',
      };
    }
  } catch (error) {
    console.error('[API Service] Error saving site content:', error);
    return {
      success: false,
      message: 'Tidak dapat terhubung ke server untuk menyimpan data.',
    };
  }
}

/**
 * Admin Gallery API
 */
export async function adminGalleryApi(method: string, id: number | null, data: FormData | object) {
  const token = localStorage.getItem('tjkt_admin_token');
  const url = id ? `${API_BASE_URL}/admin/gallery/${id}` : `${API_BASE_URL}/admin/gallery`;

  const headers: any = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  const options: RequestInit = {
    method,
    headers,
  };

  if (data instanceof FormData) {
    options.body = data;
    // Don't set Content-Type for FormData, browser will set it with boundary
  } else {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);
  return await response.json();
}

/**
 * Admin Teachers API
 */
export async function adminTeachersApi(method: string, id: number | null, data: FormData | object) {
  const token = localStorage.getItem('tjkt_admin_token');
  const url = id ? `${API_BASE_URL}/admin/teachers/${id}` : `${API_BASE_URL}/admin/teachers`;

  const headers: any = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  const options: RequestInit = {
    method,
    headers,
  };

  if (data instanceof FormData) {
    options.body = data;
  } else {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);
  return await response.json();
}

/**
 * Admin Achievements API
 */
export async function adminAchievementsApi(method: string, id: number | null, data: object) {
  const token = localStorage.getItem('tjkt_admin_token');
  const url = id ? `${API_BASE_URL}/admin/achievements/${id}` : `${API_BASE_URL}/admin/achievements`;

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}