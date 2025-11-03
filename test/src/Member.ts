export const DEFAULT_VIP_FEE:number = 900
export const DEFAULT_PUBLISH_FEE = 300;
export const DEFAULT_TAKE_FEE = 300;

export class Member {
    memberId: number
    level: number = 0
    role: "employer" | "employee" = "employee";
    balance: number = 0;
    totalRecharge: number = 0;
    totalExpense: number = 0;
    totalIncome: number = 0;
    totalTask: number = 0;
    totalTake: number = 0;
    vipFee: number = DEFAULT_VIP_FEE;
    completedTask:number = 0

    constructor(memberId: number) {
        this.memberId = memberId
        this.role = "employee"
    }

    recharge(amount:number=DEFAULT_PUBLISH_FEE) {
        this.balance += amount // 固定充值
        this.totalRecharge += amount
        this.totalExpense = this.totalExpense - this.totalRecharge

        console.log(`${this.memberId}  ${amount}`)
    }

    publishTask() {
        this.totalExpense += DEFAULT_PUBLISH_FEE
        this.balance -= DEFAULT_PUBLISH_FEE
        this.totalTask++
        
        console.log(`${this.memberId} 发布任务，支出300`)
    }

    completeTask() {
        this.role = "employee"
    }

    takeTask() {
        this.totalIncome += 600
        this.balance += 600
        this.role = "employer"

        this.totalTake++

        console.log(`${this.memberId} 承接任务`)
    }
}

export class Task{
    taskId:number
    employer1:Member
    employer2:Member
    employee:Member

    constructor(taskId:number,employer1:Member,employer2:Member,employee:Member){
        this.taskId = taskId
        this.employer1 = employer1
        this.employer2 = employer2
        this.employee = employee
    }
}

export class EmploymentService {
    static matchTask(taskId:number, employer1: Member, employer2: Member, employee: Member) {
        var task = new Task(taskId,employer1,employer2,employee)

        console.log(`\n系统撮合任务：雇主 ${employer1.memberId} + ${employer2.memberId} -> 雇员 ${employee.memberId}`)
        employer1.publishTask()
        employer2.publishTask()

        employee.takeTask()
        employer1.completeTask()
        employer2.completeTask()

        return task;
    }
}