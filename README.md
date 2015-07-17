#Yocto Jenkins

Connect a [YoctoServo](http://www.yoctopuce.com/EN/products/usb-actuators/yocto-servo) to a jenkins server a animate flags depending on the buid states:

 * if any build is running, put up one flag
 * if any build has failed, put up the other flag


#How to

##Install
Install nodeJS and

    npm install

You shall edit the `bin/watch-jenkins.js` file for appropriate Jenkins url for for setting the port onto which the servos are connected.

##Run

    nohup bin/VirtualHub &
    nohup node bin/watch-jenkins.js &