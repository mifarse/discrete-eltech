var os              = require('os');
var db				= require("./db");
var TestSchema		= require("./schemas/test");
var StudentSchema	= require("./schemas/students");

var fs 			= require('fs');
var officegen 	= require('officegen'); 


module.exports = () => {
	var agg = [
		{
		   	$match: {
		   		finished: {$exists: true}
		   	}
		},
		{
		   	$group: {
		    	_id: { testName: "$testName" },
		    	count: {$sum: 1},
		    	duration_avg: { $avg: { $divide: [ {$subtract: ["$finished", "$started"]},  1000 ] } }
		   	}
		},
		{
			$sort: {
				duration_avg: 1
			}
		}
	];

	times = {font_face: 'Times New Roman'}
	subtitle = { underline: true, font_face: 'Arial', font_size: 14 }
	date = new Date();

	var docx = officegen("docx");

	docx.on ( 'finalize', function ( written ) {
				console.log ( 'Finish to create Word file.\nTotal bytes created: ' + written + '\n' );
			});

	docx.on ( 'error', function ( err ) {
				console.log ( err );
			});


	var pObj = docx.createP({ align: 'center' });
	pObj.addText ( 'Санкт-Петербургский государственный электротехнический университет', times);
	pObj.addLineBreak ();
	pObj.addText ( ' им. В. И. Ульянова (Ленина)', times);
	pObj.addLineBreak ();

	var pObj = docx.createP({ align: 'center' });
	pObj.addText ( 'Отчет по работе системы', { underline: true, font_face: 'Arial', font_size: 16 } );
	var pObj = docx.createP({ align: 'center' });
	pObj.addText('Все представленные ниже данные актуальны на момент времени: ', {font_face: 'Times New Roman', italic: true});
	pObj.addText( date.getHours()+":"+date.getMinutes()+" "+date.getDate()+"."+(date.getMonth()+1)+"."+date.getFullYear() , times);


	TestSchema.aggregate( agg ,(err, f) => {
		
			if (err) console.log(err);
			
			ttr = {
				"nod":  "Наибольший общий делитель",
				"axby1":  "Поиск чисел, удовл. условию",
				"conversion":  "Перевод систем счисления" ,
				"horner": "Схема Горнера",
				"fastdegree": "Быстрое возведение в степень",
				"diophantine": "Диофантово уравнение",
				"convergents": "Подходящие дроби",
				"fraction": "Цепная дробь",
				"inverse": "Обратные числа"
			}
			totally = 0;				

			var pObj = docx.createP({ align: 'center' });
			pObj.addText ( 'Данные по задачам', subtitle );


			for (i = 0; i < f.length; i++){
				totally += f[i].count;
				var pObj = docx.createListOfDots ();
				time_format = Math.floor(f[i].duration_avg/60)+"м "+Math.floor(f[i].duration_avg%60)+"с";
				pObj.addText('Задача '+ttr[f[i]._id.testName]+': решено '+f[i].count+', среднее время (сек) '+time_format, times);
			}

			var pObj = docx.createP();
			pObj.addText('Студентами было решено '+totally+' задач.', times);

			pObj.addLineBreak ();
			var pObj = docx.createP({ align: 'center' });
			pObj.addText ( 'Данные по студентам', subtitle );

			StudentSchema.count({}, (err, count) => {
				var pObj = docx.createP();
				pObj.addText('К этому моменту в базе данных числится следующее количество студентов: '+count+'.', times);
				StudentSchema.find({}, (err, docs)=>{
					
					var pObj = docx.createP();
					pObj.addText('Последние зарегистрирвавшиеся: ', times);
					for (i = 0; i < docs.length; i++){
						pObj.addLineBreak	();
						website = docs[i].website ? docs[i].website : "нет сайта";
						docs[i].group = docs[i].group === undefined ? ' не указана': docs[i].group;
						pObj.addText( docs[i].last_name+" "+docs[i].first_name+" (гр."+docs[i].group+"), "+website, times);
					}

					// StudentSchema
					var gr_aggr = [
						{
							$group:{
								_id: {group: "$group"},
								count: {$sum: 1}
							}
						},
						{
							$sort: {
								"registered": -1
							}
						}
					]

					StudentSchema.aggregate(gr_aggr, (err, f) => {
						if (err) console.log(err);
						var pObj = docx.createP({ align: 'center' });
						pObj.addText ( 'Данные по группам', subtitle );
						var pObj = docx.createP();
						for (i = 0; i < f.length; i++){
							pObj.addLineBreak();
							f[i]._id.group = f[i]._id.group == null ? 'Группа не указана' : f[i]._id.group;
							pObj.addText ( f[i]._id.group+" - "+f[i].count+" чел.", times );	
						}
						
						docx.putPageBreak();
						var pObj = docx.createP({ align: 'center' });
						pObj.addText ( 'Данные о сервере', subtitle );

						var pObj = docx.createP();
						pObj.addText( 'Сервер работает уже '+Math.floor(os.uptime() / 3600)+' ч.', times);
						pObj.addText( ' К этому моменту свободной оперативной памяти '+(os.freemem()/(1024*1024)).toFixed(2)+' Мбайт.', times);
						pObj.addText( ' что составляет '+(100*os.freemem()/os.totalmem()).toFixed(1)+'% от имеющегося количества.', times);
						pObj.addText( ' Характеристики ЭВМ, на которой работает система следующие:', times);
						pObj.addText( ' архитектура процессора '+os.arch(), times);
						pObj.addText( ', имеется '+os.cpus().length+' ядер, на которые сервер равномерно распределяет нагрузку.', times);
						pObj.addText( ' Модель процессора '+os.cpus()[0].model, times);
						pObj.addText( '. Операционная система '+os.platform()+', дистрибутив '+os.type()+' версии '+os.release(), times);

						var out = fs.createWriteStream ( 'public/otchet.docx' );
						out.on ( 'error', function ( err ) {
							console.log ( err );
						});
						docx.generate ( out );
						return true;	
					})

				}).sort({_id: -1}).limit(5)
			})
	});

}