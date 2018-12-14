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
	response.send('dolbaeb');
});

app.post('/login', function (request, response) {
	console.log(request.body);
	pool.query("SELECT * FROM users WHERE phone='"+request.body.phone+"' AND password='"+request.body.password+"';", (err, res)=> {
		var answer = {};
		if(err){
			console.log(err);
			response.status(400);
		}
		else{
			
			console.log(res.rows[0])
			
			if(res.rows[0]!='undefine'){
				response.status(200);
				answer = res.rows[0];
			}
			else{
				response.status(400);
			}
		}
		response.send(answer);
	});
});

app.post('/register', function (request, response) {
        console.log(request.body.fef);
        pool.query('SELECT * FROM users WHERE phone='+'+380638921129'+' AND password='+'9cdfb439c7876e703e307864c9167a15;', (err, res)=> {
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
	pool.query('SELECT * FROM userhascar WHERE phone='+request.body.phone+';', (err, res)=> {
        	if(err){
                        console.log(err);
                        answer.status = 'Failed';
                        response.send(JSON.stringify(answer));
                        return false;
                }
		else{
			//collect all
		}
	});
	pool.query('SELECT * FROM cars WHERE  userhascar VALUES('+request.body.phone+', '+request.body.carNumber+');', (err, res)=> {
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
        pool.query('SELECT * FROM users WHERE phone='+'+380638921129'+' AND password='+'9cdfb439c7876e703e307864c9167a15', (err, res)=> {
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
