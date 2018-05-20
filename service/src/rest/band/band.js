import BaseRouter from '../BaseRouter';
import dbModels from '../../db/dbModels';


export default class band extends BaseRouter{

    getTableName(){
        return 'band';
    }

    initRoutes(dbModel){

    }
}