#include <stdlib.h>
#include <unistd.h>
#include <stdio.h>
#include <syslog.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <netdb.h>
#include <string.h>
#include <stdbool.h>
#include <arpa/inet.h>
#include <stdint.h>
#include <inttypes.h>


#define PORT 3000
uint8_t team_id;
uint8_t status;
int32_t acceleration;
int32_t position;
int32_t velocity;
int32_t battery_voltage;
int32_t battery_current;
int32_t battery_temperature;
int32_t pod_temperature;
uint32_t stripe_count;

char buffer[34];
void sCComm(int fd)
{	
	 	 do {
   		 printf("Client: ");
        do { recv(fd, buffer,sizeof(buffer) , 0);
         
            team_id=*((uint8_t*)buffer);
           
        

            printf("id:%d",team_id );
            
        } while (1); 

	} while (1);

}


int createTCPSocket()
{    //creating a server side socket 
	int fd=socket(AF_INET,SOCK_STREAM,0);
	//storing the details of the server in addr 
	struct sockaddr_in addr;
	
	addr.sin_family = AF_INET;
	addr.sin_addr.s_addr =INADDR_ANY;
	addr.sin_port = htons(PORT);
	if(connect(fd,(struct sockaddr*) &addr,sizeof(addr))>=0)
		printf("Client side connection estd.\n");
	return fd;

}












int main(int argc , char* argv[])
{
	int client;
	//calling func for creating socket and assigning its fd to fdQueue 
	client=createTCPSocket();
	
    printf("connection estd.");
    sCComm(client);
    close(client);
    printf("connection terminated\n");
    return 0;
}


