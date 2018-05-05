import BaseRouter from '../BaseRouter';
import dbModels from '../../db/dbModels';


export default class Menu extends BaseRouter{

    getTableName(){
        return 'menu';
    }

    initRoutes(dbModel){

    }
}