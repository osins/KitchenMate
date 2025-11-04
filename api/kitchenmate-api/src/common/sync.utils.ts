import { DeepPartial, EntityTarget, QueryRunner } from "typeorm";

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
    return queryRunner.manager.save(entityClass, data); 
}


export const executeWithRunner = async <T, Entity, EntityLike extends DeepPartial<Entity>>(
    values:T[] | undefined, 
    queryRunner: QueryRunner, 
    entityClass: EntityTarget<Entity>, 
    callbackfn: (value: T, index?: number, array?: any[])=>EntityLike):Promise<Entity[]>=>{
    if(values === null || values === undefined || (Array.isArray(values) && values.length==0))
        return [];

    return await executeWithMap(values, ((item, i, records) => {
          var obj = callbackfn(item, i, records)
          const data = queryRunner.manager.create(entityClass, obj);
          queryRunner.manager.save(entityClass, data);
        }));
}