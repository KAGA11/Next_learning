import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import clsx from 'clsx';
import { fetchInvoicesPages } from '@/app/lib/data';
import { Metadata } from 'next';
// import { lusitana } from '@/app/ui/fonts';

export const metadata: Metadata = {
  title: 'Invoices',
}

/**
 * 页面组件，用于渲染发票列表页面。
 * 
 * 该组件是一个异步函数组件，用于展示发票列表页面的主要内容。
 * 它接收搜索参数，包括查询关键词和当前页码，然后根据这些参数获取发票数据并渲染表格。
 * 组件还提供了搜索框、创建发票按钮和分页控件。
 * 
 * @param {Object} props - 组件的属性对象。
 * @param {Promise<{ query?: string; page?: string }>} [props.searchParams] - 一个可选的 Promise，解析后返回一个对象，包含可选的查询关键词和当前页码。
 * @returns {JSX.Element} 渲染发票列表页面的 JSX 元素。
 */
export default async function Page( props: {
  // searchParams语法：一个可选的 Promise，解析后返回一个对象，包含可选的 query 和 page 字符串属性。
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  // 等待 searchParams 解析完成，获取搜索参数对象
  const searchParams = await props.searchParams;
  // 从搜索参数中获取查询关键词，如果不存在则默认为空字符串
  const query = searchParams?.query || '';
  // 从搜索参数中获取当前页码，并转换为数字类型，如果不存在则默认为第 1 页
  const currentPage = Number(searchParams?.page) || 1

  // 根据查询关键词获取发票数据的总页数
  const totalPages = await fetchInvoicesPages(query);


  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={clsx(
          'text-2xl',
          // `${lusitana.className}`
        )}>Invoices</h1>
      </div>
      {/* 搜索框和创建发票按钮 */}
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
      {/* 使用 Suspense 包裹 Table 组件，在数据加载时显示骨架屏 */}
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        {/* 渲染发票表格，传递查询关键词和当前页码 */}
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      {/* 分页控件 */}
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}