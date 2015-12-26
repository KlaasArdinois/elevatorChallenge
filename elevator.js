{
    init: function(elevators, floors) {
        var DOWN = 0;
        var UP = 1;

        $.each(elevators, function(index, elevator) {
            if(elevators.length > 1) {
                var startFloor = Math.floor( index / (elevators.length-1) * floors.length);
                elevator.goToFloor(startFloor); 
            }
            elevator.name = "E"+index;
            elevator.startFloor = startFloor;                       
        });

        var floorWaiting = [];

        $.each(floors, function(index, floor) {
            floorWaiting[index] = [];
            floorWaiting[index][DOWN] = false;
            floorWaiting[index][UP] = false;
            floor.on("up_button_pressed", function() {
                floorWaiting[floor.floorNum()][UP] = true;
            });
            floor.on("down_button_pressed", function() {
                floorWaiting[floor.floorNum()][DOWN] = true;
            });
        });

        $.each(elevators, function(index, elevator) {
            elevator.on("idle", function() {
                //places to go?
                if(elevator.getPressedFloors().length > 0) {
                    
                    //find closest floor in list
                    var closestFloorIndex = 0;
                    var closestDistance = 100000;

                    $.each(elevator.getPressedFloors(), function(index, button) {
                        if( Math.abs(button - elevator.currentFloor()) < closestDistance ) {
                            closestDistance = Math.abs(button - elevator.currentFloor());
                            closestFloorIndex = index;
                        }
                    });

                    console.log(elevator.name + " ==> " + elevator.getPressedFloors()[closestFloorIndex] + " / drop");
                    elevator.goToFloor(elevator.getPressedFloors()[closestFloorIndex]);
                }
                //pick up waiting
                else {
                    var targetFloor = 0;
                    var minDistance = 100000;
                    $.each(floorWaiting, function(index, floor) {
                        if(floor[UP] || floor[DOWN]) {
                            if(Math.abs(index - elevator.currentFloor()) < minDistance) {
                                targetFloor = index;
                                minDistance = Math.abs(index - elevator.currentFloor());
                            }
                        }                        
                    });
                    console.log(elevator.name + " ==> " + targetFloor + " / pickup");
                    elevator.goToFloor(targetFloor);                    
                }
            });
            elevator.on("stopped_at_floor", function (floor) {
                floorWaiting[floor][UP] = false;
                floorWaiting[floor][DOWN] = false;
            });
        }); 
    },
        update: function(dt, elevators, floors) {
            // We normally don't need to do anything here       
        }
}