import { Result } from "src/models/result.entity";
import { DeepPartial, EntityTarget, QueryRunner, UpdateResult } from "typeorm";

export const execute = async (values:any)=>{
    return await Promise.all(values);
}

export const executeWithMap = async <T>(values:T[]|undefined, callbackfn: (value: T, index?: number, array?: any[])=>any)=>{
    if(values === null || values === undefined || (Array.isArray(values) && values.length==0))
       return [];
    return await execute(values.map(callbackfn));
}

export const executeOneWithRunner = async <Entity, EntityLike extends DeepPartial<Entity>>(
    values:any, 
    queryRunner: QueryRunner, 
    entityClass: EntityTarget<Entity>, 
    callbackfn: ()=>EntityLike)=>{
    if(values === null || values === undefined || (Array.isArray(values) && values.length==0))
        return;

    var obj = callbackfn()
    const data = queryRunner.manager.create(entityClass, obj);
    return queryRunner.manager.save(entityClass, data); 
}

export const executeSaveObjectWithRunner = async <Entity, EntityLike extends DeepPartial<Entity>>(
    queryRunner: QueryRunner, 
    entityClass: EntityTarget<Entity>, 
    obj: EntityLike)=>{
    const data = queryRunner.manager.create(entityClass, obj);
    const result = await queryRunner.manager.save(entityClass, data); 

    console.log(`create by obj:`, obj, data, result)

    return result;
}


export const executeWithRunner = async <T, Entity, EntityLike extends DeepPartial<Entity>>(
    values:T[] | undefined, 
    queryRunner: QueryRunner, 
    entityClass: EntityTarget<Entity>, 
    callbackfn: (value: T, index?: number, array?: any[])=>Promise<EntityLike> | EntityLike):Promise<Entity[]>=>{
    if(values === null || values === undefined || (Array.isArray(values) && values.length==0))
        return [];

    const results: Entity[] = [];
    for (let i = 0; i < values.length; i++) {
        const value = values[i];
        const obj = await callbackfn(value, i, values);
        const data = queryRunner.manager.create(entityClass, obj);
        const saved = await queryRunner.manager.save(entityClass, data);
        results.push(saved as Entity);
    }
    return results;
}


export const executeUpdateWithRunner = async <Entity extends Object>(
    where: any, 
    queryRunner: QueryRunner, 
    entityClass: EntityTarget<Entity>, 
    partialEntity: DeepPartial<Entity>
):Promise<any>=>{
    if(where === null || where === undefined)
        return []

    return await queryRunner.manager.update(entityClass, where, partialEntity as any);
}

export const executeUpdateByWheresWithRunner = async <Entity extends Object>(
    wheres: any[], 
    queryRunner: QueryRunner, 
    entityClass: EntityTarget<Entity>, 
    partialEntity: DeepPartial<Entity>
):Promise<UpdateResult[] | null>=>{
    if(wheres === null || wheres === undefined || wheres.length === 0)
        return null

    const results: UpdateResult[] = [];

    for(const where of wheres){
        const updateResult = await queryRunner.manager.update(entityClass, where, partialEntity as any);
        results.push(updateResult);
    }

    // 返回最后一个更新结果，或者可以根据需要返回汇总结果
    return results;
}