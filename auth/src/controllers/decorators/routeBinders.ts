import 'reflect-metadata';
import { METHOD, MetadataKeys } from './constants';
function routeBinders(method: string) {
    return function(path:string) {
        return function(target: any, key:string) {
            Reflect.defineMetadata(MetadataKeys.METHOD,method,target,key);
            Reflect.defineMetadata(MetadataKeys.PATH,path, target,key);
        }
    }
}

export const get = routeBinders(METHOD.GET);
export const post = routeBinders(METHOD.POST);
export const put = routeBinders(METHOD.PUT);
export const del = routeBinders(METHOD.DELETE);