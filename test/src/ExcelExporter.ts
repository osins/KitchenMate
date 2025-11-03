import * as XLSX from 'xlsx';
import { Member, Task } from '@/Member';

export class ExcelExporter {
    
    static exportMembersAndTasks(members: Member[], tasks: Task[], filename: string = 'members_tasks_export.xlsx') {
        // 创建工作簿
        const workbook = XLSX.utils.book_new();
        
        // 创建会员数据工作表
        const membersData = this.formatMembersData(members);
        const membersSheet = XLSX.utils.json_to_sheet(membersData);
        XLSX.utils.book_append_sheet(workbook, membersSheet, '会员数据');
        
        // 创建任务数据工作表
        const tasksData = this.formatTasksData(tasks);
        const tasksSheet = XLSX.utils.json_to_sheet(tasksData);
        XLSX.utils.book_append_sheet(workbook, tasksSheet, '任务数据');
        
        // 创建统计信息工作表
        const statsData = this.formatStatisticsData(members, tasks);
        const statsSheet = XLSX.utils.json_to_sheet(statsData);
        XLSX.utils.book_append_sheet(workbook, statsSheet, '统计信息');
        
        // 导出Excel文件
        XLSX.writeFile(workbook, filename);
        console.log(`数据已导出到: ${filename}`);
    }
    
    private static formatMembersData(members: Member[]): any[] {
        return members.map(member => ({
            '会员ID': member.memberId,
            '角色': member.role,
            '当前余额': member.balance,
            '总充值': member.totalRecharge,
            '总支出': member.totalExpense,
            '总收入': member.totalIncome,
            '总任务数': member.totalTask,
            '总承接数': member.totalTake,
            '已完成任务数': member.completedTask,
            'VIP费用': member.vipFee,
            '净收益': member.totalIncome - member.totalExpense
        }));
    }
    
    private static formatTasksData(tasks: Task[]): any[] {
        return tasks.map(task => ({
            '任务ID': task.taskId,
            '雇主1ID': task.employer1.memberId,
            '雇主2ID': task.employer2.memberId,
            '雇员ID': task.employee.memberId,
            '雇主1角色': task.employer1.role,
            '雇主2角色': task.employer2.role,
            '雇员角色': task.employee.role
        }));
    }
    
    private static formatStatisticsData(members: Member[], tasks: Task[]): any[] {
        const totalMembers = members.length;
        const totalTasks = tasks.length;
        const totalRecharge = members.reduce((sum, m) => sum + m.totalRecharge, 0);
        const totalIncome = members.reduce((sum, m) => sum + m.totalIncome, 0);
        const totalExpense = members.reduce((sum, m) => sum + m.totalExpense, 0);
        const employers = members.filter(m => m.role === 'employer').length;
        const employees = members.filter(m => m.role === 'employee').length;
        
        return [
            { '统计项': '总会员数', '数值': totalMembers },
            { '统计项': '总任务数', '数值': totalTasks },
            { '统计项': '总充值金额', '数值': totalRecharge },
            { '统计项': '总收入金额', '数值': totalIncome },
            { '统计项': '总支出金额', '数值': totalExpense },
            { '统计项': '雇主数量', '数值': employers },
            { '统计项': '雇员数量', '数值': employees },
            { '统计项': '系统总余额', '数值': totalRecharge - totalExpense }
        ];
    }
}
