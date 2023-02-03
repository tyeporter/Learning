/**** Enums ****/

enum Gender {
	MALE,
	FEMALE
}

console.log(Gender.MALE);
console.log(Gender.FEMALE);
console.log(Gender[0]);
console.log(Gender[1]);


enum Weekdays {
	MON = 'Monday',
	TUE = 'Tuesday',
	WED = 'Wednesday',
	THU = 'Thursday',
	FRI = 'Friday'
}

console.log(Weekdays.FRI);
console.log(Weekdays['Friday']);  // undefined
