import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import clsx from 'clsx';
import { Suspense } from 'react';
import CardWrapper from '@/app/ui/dashboard/cards';
import { 
  RevenueChartSkeleton, 
  LatestInvoicesSkeleton,
  CardsSkeleton
} from '@/app/ui/skeletons'; 
// import { lusitana } from '@/app/ui/fonts';

/**
 * 页面组件，用于渲染仪表盘页面。
 * 
 * 该组件是一个异步函数组件，用于展示仪表盘页面的主要内容。
 * 它包含一个标题和多个卡片组件，以及一个收入图表和最新发票列表。
 * 组件使用了 React 的 Suspense 来处理异步加载，并提供了骨架屏作为加载占位符。
 * 
 * @returns {JSX.Element} 渲染仪表盘页面的 JSX 元素。
 */
export default async function Page() {
  return (
    <main>
      <h1 className={clsx(
        'mb-4 text-xl md:text-2xl',
        // `${lusitana.className} `
      )}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* 使用 Suspense 包裹 CardWrapper 组件，在数据加载时显示 CardsSkeleton 骨架屏 */}
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/* 使用 Suspense 包裹 RevenueChart 组件，在数据加载时显示 RevenueChartSkeleton 骨架屏 */}
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        {/* 使用 Suspense 包裹 LatestInvoices 组件，在数据加载时显示 LatestInvoicesSkeleton 骨架屏 */}
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div>
    </main>
  );
}