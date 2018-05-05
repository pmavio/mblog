const sql = require('mssql');
const config = {
    user: 'sa',
    password: '111111',
    server: '192.168.65.73',
    database: 'MEETING'
};
async function run() {
    const pool = await sql.connect(config);
    const result = await sql.query`select * from IntSummary_Base`
    // const result = await sql.query`insert into IntSummary_Base values (1, 203, 0, '会议室', 0001, '2018-04-10 09:14:00.000', 10, 3, '2018-04-10 09:14:00.000', 100)`
    console.log(result.recordsets);
}
run()
    .then(res=>{})
    .catch(err=>console.log({err}))