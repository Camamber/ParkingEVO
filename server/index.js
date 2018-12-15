const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const app = express();

const server = require('http').createServer(app);
//const io = require('socket.io')(server);

app.use(express.json());
app.use(express.static(path.join(__dirname,'/public')))
app.engine('.hbs', exphbs({
    defaultLayout: 'index',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts')
}))

app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'views'))

const {Pool}= require('pg');
const pool = new Pool({
        user: 'evo',
        host: 'localhost',
        database: 'parking_evo',
        password: 'qwerty123',
        port: 5432,
});

app.get('/', function (request, response) {
	response.send('PARKING EVO');
});

app.post('/login', function (request, response) {
	console.log(request.body);
	pool.query("SELECT * FROM users WHERE phone='"+request.body.phone+"' AND password='"+request.body.password+"';", (err, res)=> {
		var answer = {};
		if(err){
			console.log(err);
			answer.status=400;
			console.log(answer);
                	response.send(answer);		
		}
		else{
			if(res.rows[0]!='undefine'){
				answer.user = res.rows[0];
				
				var cars = [];
			        var list = '(';

        			pool.query("SELECT * FROM userhascar WHERE phone='" + answer.user.phone + "';", (err1, res1)=> {
                			if(err1){
                        			console.log("FIRST ", err1);
						response.status = 400;
						response.send(answer);
                			}
                			else{
                        			for(var i = 0; i<res1.rows.length;i++){
                                			list += "'"+res1.rows[i].carnumber+"',";
                        			}
                        			list=list.slice(0, -1) + ')';
                        			console.log(list);

                        			pool.query('SELECT * FROM cars WHERE carnumber IN ' + list + ';', (err2, res2)=> {
                        				if(err2){
								answer.status = 400;
                                				console.log(err2);
                        					response.send(answer);
							}
                        				else {
                                				for(var i = 0; i<res2.rows.length;i++){
                                        				cars.push(res2.rows[i]);
                                				}
								answer.cars = cars;
                                				answer.status = 200;
								console.log(answer);
                                				response.send(answer);
                        				}				
                        			});
                			}
        			});
			}
			else{
				answer.status = 400;
				console.log(answer);
                          	response.send(answer);
			}
		}
	});
});

app.post('/register', function (request, response) {
        console.log("reg new user");
});

app.post('/addcar', function (request, response) {
        console.log(request.body.fef);
	var answer = {};
        pool.query('INSERT INTO cars VALUES('+request.body.carNumber+', '+request.body.color+', '+request.body.carNickName+', '+request.body.brand+');', (err, res)=> {
                if(err){
                        console.log(err);
                        answer.status = 'Failed';
			response.send(JSON.stringify(answer));
                	return false;
		}
        });
	pool.query('INSERT INTO userhascar VALUES('+request.body.phone+', '+request.body.carNumber+');', (err, res)=> {
		if(err){
        		console.log(err);
                	answer.status = 'Failed';
                       	response.send(JSON.stringify(answer));
                	return false;
		}
        });
});


app.post('/parking', function (request, response) {
        console.log(request.body);
        pool.query('SELECT * FROM users WHERE phone=' + '+380638921129' + ' AND password=' + '9cdfb439c7876e703e307864c9167a15', (err, res)=> {
                if(err){
                        console.log(err);
                        response.send('WRONG');
                }
                else{
                        console.log(res.rows[0])
                        response.send('OK!');
                }
        });
});

app.listen(3001, function () {
  console.log('Example app listening on port 3001!');
});
