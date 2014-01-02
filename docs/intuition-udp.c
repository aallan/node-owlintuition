/* Sample UDP server */

#include <sys/socket.h>
#include <netinet/in.h>
#include <stdio.h>

int main(int argc, char**argv)
{
    int sockfd,n;
    struct sockaddr_in servaddr,cliaddr;
    socklen_t len;
    char mesg[1000];
    int ct = 0;

    sockfd=socket(AF_INET,SOCK_DGRAM,0);

    bzero(&servaddr,sizeof(servaddr));
    servaddr.sin_family = AF_INET;
    servaddr.sin_addr.s_addr=htonl(INADDR_ANY);
    servaddr.sin_port=htons(32000);
    bind(sockfd,(struct sockaddr *)&servaddr,sizeof(servaddr));

    for (;;)
    {
        len = sizeof(cliaddr);
        n = recvfrom(sockfd,mesg,1000,0,(struct sockaddr *)&cliaddr,&len);

        printf("-------------------------------------------------------\n");
        mesg[n] = 0;
        printf("Received the following:\n");
        printf("%s\n",mesg);
        printf("-------------------------------------------------------\n");
/* -- This requires a valid UDP key before it can be enabled 
        if (++ct > 5)
        {
            char buf[10];
            ct = sprintf(buf, "GET,MAC,xxxxxxxx");
            sendto(sockfd,buf,ct,0,(struct sockaddr *)&cliaddr,sizeof(cliaddr));
            ct = 0;
            printf("Sending GET,MAC Command\n");
        }
*/
    }
}
