'use server';
import { z } from 'zod';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type State = {
    errors?: {
      customerId?: string[];
      amount?: string[];
      status?: string[];
    };
    message?: string | null;
};



const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
 
const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: 'Please select a customer.',
    }),
    amount: z.coerce.number().gt(0, { message: 'Please enter an amount greater than $0.' }),
    status: z.enum(['pending', 'paid'],{
        invalid_type_error: 'Please select an invoice status.',
    }),
    date: z.string(),
})


const CreateInvoice = FormSchema.omit({ id: true, date: true });

/**
 * 创建发票的异步服务器动作。
 * 
 * 该函数接收一个 FormData 对象，解析其中的客户 ID、金额和状态，
 * 将金额转换为美分，并获取当前日期，然后将这些数据插入到数据库的发票表中。
 * 插入成功后，会重新验证发票页面的缓存，并将用户重定向到发票页面。
 * 
 * @param {FormData} formData - 包含客户 ID、金额和状态的表单数据。
 * @throws {Error} 如果表单数据解析失败或数据库插入操作失败。
 */
export async function createInvoice(prevState: State, formData: FormData) {
    // 从表单数据中提取客户 ID、金额和状态，并使用 CreateInvoice 模式进行解析
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Missing Fields. Failed to Create Invoice.',
        };
    }

    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];
 

    try {
         // 执行 SQL 插入操作，将发票数据插入到数据库中
        await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `  
    } catch (error) {
        console.error(error);   
    }
    // 重新验证发票页面的缓存，确保页面数据是最新的
    revalidatePath('/dashboard/invoices');
    // 将用户重定向到发票页面
    redirect('/dashboard/invoices');
}


// update
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
 
export async function updateInvoice(id: string, prevState:State, formData: FormData) {
    const validatedFields = UpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
      });
     
    if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Missing Fields. Failed to Update Invoice.',
        };
    }
  
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    
  try {
        await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
      `;
  } catch (error) {
        console.error('Failed to update invoice:', error);
        throw new Error('Failed to update invoice.');
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}


// delete
export async function deleteInvoice(id: string) {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
}