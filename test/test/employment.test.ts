import { Member, EmploymentService, DEFAULT_VIP_FEE, Task } from '../src/Member'
import { ExcelExporter } from '../src/ExcelExporter'

let memberId=0
const t = new Member(memberId)

let totalVipFee = 0
let members: Member[] = []

const register = ()=>{
    var m = new Member(memberId++)
    m.recharge()

    members.push(m);

    totalVipFee += DEFAULT_VIP_FEE

    return m
}

const memberNotExists = ()=>{
    t.recharge()
    return t
}

describe('会员与雇佣服务测试', () => {
    let a: Member
    let b: Member
    let c: Member

    beforeEach(() => {
        a = new Member(memberId++)
        b = new Member(memberId++)
        c = new Member(memberId++)

        a.recharge()
        b.recharge()
        c.recharge()
    })

    test('发布任务雇主支出300,雇员得600', () => {
        let taskId = 0;

        EmploymentService.matchTask(taskId++,a,b,t)

        expect(a.balance).toBe(0) // 充值300 - 支出300
        expect(a.totalIncome).toBe(0)

        expect(b.balance).toBe(0) // 充值300 - 支出300
        expect(b.totalIncome).toBe(0)

        expect(t.balance).toBe(600) // 收益
        expect(t.totalIncome).toBe(600)

        //
        
        b.recharge()

        EmploymentService.matchTask(taskId++,c,b,a)

        expect(c.balance).toBe(0) // 收益
        expect(c.totalIncome).toBe(0)

        expect(b.balance).toBe(0) // 充值300 - 支出300
        expect(b.totalIncome).toBe(0)

        expect(a.balance).toBe(600) // 充值300 - 支出300
        expect(a.totalIncome).toBe(600)

        // 

        c.recharge()

        EmploymentService.matchTask(taskId++,c,a,b)

        expect(c.balance).toBe(0) // 收益
        expect(c.totalIncome).toBe(0)

        expect(a.balance).toBe(300) // 充值300 - 支出300
        expect(a.totalIncome).toBe(600)

        expect(b.balance).toBe(600) // 充值300 - 支出300
        expect(b.totalIncome).toBe(600)

        //

        EmploymentService.matchTask(taskId++,a,b,c)

        expect(a.balance).toBe(0) // 充值300 - 支出300
        expect(a.totalIncome).toBe(600)

        expect(b.balance).toBe(300) // 充值300 - 支出300
        expect(b.totalIncome).toBe(600)

        expect(c.balance).toBe(600) // 收益
        expect(c.totalIncome).toBe(600)

        // 
        expect(a.totalIncome).toBe(600)
        expect(b.totalIncome).toBe(600)
        expect(c.totalIncome).toBe(600)
    })

    test('测试100个会员, 100个任务', () => {
        memberId = 1
        members = [];
        const tasks: Task[] = []

        for (let i = 1; i <= 10000; i++) {
            const minTotalTake = members.reduce((min, member) => 
                Math.max(min, member.totalTake), 0);

            var employers : Member[] = members.filter(m => m.role === "employer" && m.balance>0)
            var employees : Member[] = members.filter(m => m.role === "employee" && m.totalIncome==0)

            var employer1 = employers.length>0 ? employers[0] : register(); 
            var employer2 = employers.length>1 ? employers[1] : register(); 
            var employee = employees.length>0 ? employees[0] : memberNotExists(); 
            
            var task = EmploymentService.matchTask(i, employer1, employer2, employee);
            tasks.push(task)
        }

        var balanceMax = members.reduce((max, member) => {
            if(member.balance>0){
                console.log(`member id: ${member.memberId}: ${member.balance}(max: ${max}), income: ${member.totalIncome}, expense: ${member.totalExpense}, total balance: ${member.balance+member.totalIncome-member.totalExpense}`)
            }
            return Math.max(max, member.balance)
        }, 0)
        
        var totalRecharge = members.reduce((total, member) => total + member.totalRecharge, 0)
        var notTakeMembers = members.filter(m => m.role === "employer" && m.totalIncome==0)
        var balanceMembers = members.filter(m => m.balance >= 0)
        var totalIncome = members.reduce((total, member) => total + member.totalIncome, 0)
        var totalExpense = members.reduce((total, member) => total + member.totalExpense, 0)

        // 统计所有余额大于等于零的会员相加的总余额
        let totalBalance = 0;
        balanceMembers.forEach(m=>totalBalance+=m.balance)

        console.log(members.map(m=>m.memberId))

        notTakeMembers.forEach(m=>{
            console.log(`member id: ${m.memberId}: balance: ${m.balance}, income: ${m.totalIncome}, expense: ${m.totalExpense}, total balance: ${m.balance+m.totalIncome-m.totalExpense}`)
        })

        console.log(t)

        console.log(`
            total vip fee: ${totalVipFee}, member number: ${balanceMembers.length}(total: ${members[members.length-1].memberId}) 
            total balance: ${totalBalance}/(total recharge: ${totalRecharge})=${totalBalance/totalRecharge}
            total income: ${totalIncome}
            total expense: ${totalExpense}
            total income - total expense: ${totalIncome-totalExpense}
            not take number: ${notTakeMembers.length}
            balance max: ${balanceMax}
            total task: ${tasks.length}
            `)
        
        ExcelExporter.exportMembersAndTasks(members,tasks, `${__dirname}/../output/members-${Date.now()}.xlsx`);
    });
})
