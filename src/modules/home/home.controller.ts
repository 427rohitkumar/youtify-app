'use server';

import { HomeService } from './home.service';
import { HomeData } from './home.types';

export async function getHomeDataAction(): Promise<HomeData> {
  try {
    const data = await HomeService.getDashboardData();
    // Stringify to ensure POJO serialization for Server Components
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error('Home Data Action Error:', error);
    throw new Error('Failed to load home dashboard');
  }
}
