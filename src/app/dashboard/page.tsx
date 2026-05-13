import { getHomeDataAction } from '@/modules/home/home.controller';
import { HomeDashboard } from '@/components/home/HomeDashboard';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const data = await getHomeDataAction();

  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeDashboard data={data} />
    </Suspense>
  );
}

function HomeSkeleton() {
  return (
    <div className="space-y-10 animate-pulse">
      <div className="h-12 w-64 bg-white/5 rounded-2xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-32 bg-white/5 rounded-3xl" />
        <div className="h-32 bg-white/5 rounded-3xl" />
      </div>
      <div className="space-y-6">
        <div className="h-8 w-40 bg-white/5 rounded-xl" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-square bg-white/5 rounded-3xl" />
              <div className="h-4 bg-white/5 rounded-lg w-3/4" />
              <div className="h-3 bg-white/5 rounded-lg w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
