import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';
import { fetchCardData } from '@/app/lib/data';
import clsx from 'clsx';
// import { lusitana } from '@/app/ui/fonts';

const iconMap = {
  collected: BanknotesIcon,
  customers: UserGroupIcon,
  pending: ClockIcon,
  invoices: InboxIcon,
};

/**
 * 异步函数组件，用于包裹多个卡片组件并展示卡片数据。
 * 
 * 该组件会调用 `fetchCardData` 函数从数据库中获取卡片数据，
 * 然后将这些数据传递给 `Card` 组件进行展示。
 * 
 * @returns {JSX.Element} 包含多个 `Card` 组件的 JSX 元素。
 */
export default async function CardWrapper(){
  // 调用 fetchCardData 函数从数据库中获取卡片数据
  const {
    numberOfInvoices,
    numberOfCustomers,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchCardData();
  
  return (
    <>
      {/* 渲染 */}
      <Card title="Collected" value={totalPaidInvoices} type="collected" />
      <Card title="Pending" value={totalPendingInvoices} type="pending" />
      <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
      <Card
        title="Total Customers"
        value={numberOfCustomers}
        type="customers"
      />
    </>
  );
}

// CardWrapper 里的 Card 组件
export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'invoices' | 'customers' | 'pending' | 'collected';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={clsx(
          'truncate rounded-xl bg-white px-4 py-8 text-center text-2xl',
          // `${lusitana.className} `
        )
      }
      >
        {value}
      </p>
    </div>
  );
}
