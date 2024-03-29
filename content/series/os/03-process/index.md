---
title: "프로세스"
date: 2023-07-03T08:57:16+09:00
author: Sunghun Son
summary: "프로세스의 개념과 상태, 제어 블록, 스레드, 스케줄링에 대해 알아보자."
keywords: ["운영체제", "Operating System", "프로세스", "프로세스 개념", "프로세스 상태", "프로세스 제어 블록", "스레드", "프로세스 스케줄링", "스케줄링 큐", "스케줄러", "단기 스케줄러", "장기 스케줄러", "중기 스케줄러", "문맥 교환", "프로세스 연산 작업", "프로세스 생성", "프로세스 종료"]
tags: []
pin: false
---

## 프로세스 개념

일괄처리 시스템에서는 잡(job)을 실행하고, 멀티테스킹 시스템은 테스크(task)를 가진다. 어떤 시스템은 프로그램을 실행한다. 이 다양한 용어를 통합해 프로세스라고 한다. 프로세스의 등장 이전의 개념들이 잡이라는 용어를 주로 써왔기 때문에, 요즘은 프로세스와 잡을 혼용해서 쓴다.

### 프로세스

{{< figure src="./process_on_memory.png" caption="메모리 상의 프로세스" >}}

프로세스는 메모리에 적재된 텍스트 섹션(코드), 프로그램 카운터, 스택, 데이터 섹션, 힙의 집합이다. 비공식적으로는, 실행 중인 프로그램이다.

프로그램과 프로세스를 혼동하면 안된다. 프로그램은 디스크에 위치하며, 실행 가능한 파일이고 수동적이다. 프로세스는 프로그램 카운터로 현재 명령의 위치를 나타낼 수 있는 능동적인 존재이다.

### 프로세스 상태

{{< figure src="./process_diagram.png" caption="프로세스 상태 다이어그램 (Diagram of process state)" >}}

- **New** : 프로세스가 생성 중이다.
- **Ready** : 프로세스는 실행 준비를 끝마쳤고, CPU가 처리하기를 기다린다.
- **Running** : CPU가 프로세스의 명령어를 처리하고 있다.
- **Waiting** : 프로세스는 키보드 입력같은 특정 이벤트를 기다리고 있다.
- **Terminated** : 프로세스가 완료되었다.

CPU는 한 번에 하나의 프로세스 밖에 처리하지 못 하기 때문에, 오직 하나의 프로세스만이 Running 상태에 있을 수 있다.

### 프로세스 제어 블록 (PCB)

프로세스 제어 블록(PCB, Process Control Block)은 프로세스를 표현하는 모든 정보의 집합이다. 이 정보 덕분에 중간에 작업이 끊겨도 나중에 끊긴 부분부터 다시 시작할 수 있다.

- **프로세스 상태** : Running, New 등
- **프로그램 카운터** : 다음에 CPU가 실행할 명령어의 주소
- **CPU 레지스터** : CPU가 직접적으로 가지는 변수들
- **CPU 스케줄링 정보** : 우선순위 정보나 스케줄링 큐의 포인터 정보 등
- **메모리 관리 정보** : 페이지 테이블이나 세그먼트 테이블 등
- **회계(accounting) 정보** : CPU 사용 시간, 시간 제한 등
- **입출력 상태 정보** : 프로세스에게 할당된 입출력 장치들과 열린 파일의 목록

### 스레드

멀티테스킹 기법 덕분에 우리는 여러 프로세스들이 동시에 실행되는 것처럼 느낄 수 있다. 그러면 프로세스 안에서 여러 작업들을 동시에 하고 싶으면 어떻게 해야 할까? 스레드는 프로세스 안에서 하나의 작업만을 수행하는 단위이다. 멀티프로세서 시스템에서 스레드는 완전히 병렬적으로 실행될 수도 있다.

## 프로세스 스케줄링

Waiting 상태의 프로세스 중 하나를 적절히 선택해 실행하는 방법을 말한다.

### 스케줄링 큐 (Queue)

모든 프로세스는 잡 큐에 존재한다. 이 중 준비 상태인 프로세스는 준비 큐라 불리는 링크드 리스트에 존재한다. 준비 큐의 프로세서는 CPU를 할당받고(dispatch) 실행 상태로 바뀌어 처리된다. 실행 중인 프로세스가 입출력이 필요해 대기 상태로 바뀌면, 해당 프로세스는 필요한 장치의 장치 큐에서 대기한다. 프로세스가 종료하면 할당된 모든 자원은 반납한다(deallocate).

프로세스 스케줄링은 큐잉 다이어그램으로 표현하는데, 사각형이 큐를 뜻한다.

{{< figure src="./queing_diagram.png" caption="큐잉 다이어그램으로 표현한 프로세스 스케줄링" >}}

### 스케줄러

#### 단기 스케줄러 (CPU 스케줄러)

백 밀리초에 한 번씩은 실행되며, 준비 큐에서 프로세스를 선택해 CPU로 디스패치한다. 굉장히 빈번하게 실행되기 때문에 매우 빨라야 한다.

#### 장기 스케줄러 (잡 스케줄러)

수 분에 한 번씩 실행될 수 있으며, 메모리에 있는 프로세스 수(다중 프로그램의 정도)를 안정적이게 조정한다. 또 프로세스는 입출력 중심과 CPU 중심으로 분류할 수 있다. 장기 스케줄러는 이 두 부류의 프로세스들을 적절히 혼합하여 준비 큐에 늘 적절한 수의 프로세스가 있도록 해야 한다.

#### 중기 스케줄러

시분할 시스템 같은 일부 프로세서는 프로세스들을 메모리에서 디스크로 옮기거나 다시 불러와 다중 프로그램의 정도를 완화하는 중기 스케줄러를 따로 두기도 한다. 이 방식을 스와핑(swapping)이라 한다.

### 문맥 교환 (Context Switch)

인터럽트가 발생하면 CPU는 현재 프로세스를 중지한다. 프로세스는 나중에 멈춘 지점부터 다시 실행되어야 하기 때문에 현재 상태를 저장하고 있어야 한다. 현재 상태를 PCB에 저장(state save)하고 복구하는(state restore) 과정을 문맥 교환이라 한다. 문맥 교환은 순수한 오버헤드로, 하드웨어가 지원하는 기능에 따라 속도가 다 다르다.

## 프로세스 연산 작업

프로세스는 병렬 실행될 수 있고, 동적으로 생성되고 제거되어야 한다.

### 프로세스 생성

[컴퓨터 시스템 동작](/series/os/01-intro/index.md#컴퓨터-시스템-동작)에서 부팅을 시작하면 제일 먼저 init 프로세스를 실행한다고 했다. init은 프로세스 식별자(pid) 1을 가지고, 모든 프로세스는 init을 루트로 자식 프로세스를 만드는 트리 구조를 형성한다.

예를 들어 유저가 로그인을 하면 login 프로세스가 인증을 수행한 뒤 bash 셸를 생성해 유저에게 준다. 유저가 bash를 통해 ps나 emacs 명령을 사용하면 bash 프로세스가 자신의 하위 프로세스로 해당 명령들을 생성해 수행한다.

{{< figure src="./linux_process_tree.png" caption="보편적인 Linux 시스템의 프로세스 트리" >}}

자식 프로세스를 관리하는 방법은 시스템과 코드에 따라서 선택할 수 있다.

- **자원 할당** : 운영체제에게 새 자원을 요구하거나, 부모의 자원을 분할하여 자식에게 할당한다.
- **운영** : 부모와 자식을 병렬적으로 실행하거나, 부모는 일부 또는 모든 자식이 종료될 때까지 기다린다.
- **프로그램과 데이터** : 자식은 부모와 똑같은 프로그램과 데이터를 가지거나, 자신만의 프로그램을 가진다.

{{< figure src="./fork_system_call.png" caption="fork() 시스템 호출을 사용한 프로세스 생성" >}}

- **위 그림의 C언어 코드**

    ```c
    #include <sys/types.h>
    #include <stdio.h>
    #include <unistd.h>

    int main(void)
    {
        pid_t pid = fork();

        if (pid == -1) {
            fprintf(stderr, "Fork failed");
            return EXIT_FAILURE;
        }
        else if (pid == 0) {
            printf("Hello from the child process!\n");
        }
        else {
            wait(NULL);
            printf("Child complete");
        }
        return EXIT_SUCCESS;
    }
    ```

fork()는 자식 프로세스를 만들고 자식의 pid로 0을 반환하는 시스템 호출이다. 단순히 fork만 사용했을 때는 자식 프로세스는 부모의 프로그램과 데이터를 그대로 사용한다. 이후 exec() 호출을 통해 프로세스의 주소 공간을 새 프로그램으로 덮어 써서 부모와는 다른 프로그램을 실행한다. 부모와 자식은 병렬적으로 실행되지만, 부모는 자식이 끝날 때까지 기다리고 싶을 수 있다. 이때 wait() 호출로 자식을 기다릴 수 있고, 자식이 종료될 때까지 준비 큐에서 제거된다. 마지막으로 자식 프로세스는 exit()을 호출해 프로그램을 끝낸다.

### 프로세스 종료

exit()을 호출하면 자식 프로세스는 wait()으로 기다리고 있는 부모에게 상태값을 반환할 수 있다. 그리고 운영체제는 물리 메모리, 가상 메모리, 열린 파일, 입출력 버퍼를  포함한 모든 자원을 회수한다.

exit외에 프로세를 종료하는 방법에는 부모가 자식을 종료하거나, 사용자가 프로세스를 죽일 수도 있다(kill). 또한 몇몇 시스템에서는 부모가 종료한 이후에 자식 프로세스가 존재할 수 없다. 따라서 부모가 종료되면 모든 자식 프로세스는 연쇄식 종료(cascading termination)된다.

좀비 프로세스는 자식 프로세스는 종료했는데 부모가 wait() 호출로 상태값을 반환받지 않았기 때문에 아직 자원을 반납하지 않은 프로세스를 말한다. 고아 프로세스는 부모는 종료했는데 자식은 종료하지 않았을 때를 말한다. 트리를 유지하기 위해 고아 프로세스는 init 프로세스의 자식이 된다. init은 주기적으로 wait을 호출해 고아 프로세스의 상태를 수집한다.

## 프로세스 간 통신 (IPC, Interprocess Communication)

프로세스에는 다른 프로세스와 소통하는 협력적인 프로세스와 그렇지 않은 독립적인 프로세스가 있다. 협력적인 프로세스를 프로세스간의 정보를 공유하거나, 큰 작업을 잘게 쪼갠 다음 병렬적으로 실행해서 계산을 가속화할 수 있는 장점이 있다. IPC를 통해 우리는 음악 듣기, 문서 편집 등 여러 작업들을 구분하여 편의성을 높이고, 모듈화할 수 있다.

[프로세스 간 통신 (IPC)](/series/os/02-os-structure/index.md#프로세스-간-통신-ipc)에서 IPC에는 공유 메모리와 메시지 전달 모델이 있다고 배웠다. 공유 메모리는 구축할 때 한 번만 시스템 호출이 필요하고, 구축되면 일반적인 메모리처럼 접근할 수 있어 빠르지만, 캐싱 일관성 문제가 발생하기 때문에 성능이 떨어진다. 메시지 전달은 전달 할 때마다 시스템 호출을 사용하지만, 구현이 쉽고 일관성 문제에서 자유롭다. 일관성 문제는 코어의 수가 늘어날 수록 어려워지므로 요즘에는 메시지 전달 모델이 더 나은 성능을 보인다.

### 공유 메모리 시스템

프로세스는 자신의 주소 공간에 공유 메모리 세그먼트를 생성한다. 다른 프로세스들은 이 세그먼트를 자신의 주소 공간에 추가한다. 그런 다음 운영체제에게 다른 프로세스의 메모리에 접근한다는 동의를 받아낸 후 정보를 교환한다.

협력 프로세스는 일반적으로 생산자-소비자 문제로 변환해서 생각한다. 생산자는 데이터를 생산하고, 소비자는 데이터를 소비한다. 중간에는 버퍼를 둬서 둘 사이의 완급을 조절한다. 버퍼에는 무한 버퍼와 유한 버퍼가 있다. 유한 버퍼는 주로 원형 큐를 통해 구현한다. 생산자가 동시에 버퍼에 접근하는 문제에 대해서는 [프로세스 동기화](https://www.notion.so/17d4d0a9ac474e62a71c4cd04a8b8d0d?pvs=21)에서 알아보자.

{{< figure src="./buffer.png" caption="유한 버퍼와 무한 버퍼" >}}

### 메시지 전달 시스템

프로세스는 최소 send, receive 연산을 구현한다. 메시지의 길이는 고정 길이이거나 가변 길이일 수 있다. 고정 길이를 사용하면 시스템 수준의 구현은 쉽지만 시스템을 사용하는데 어려움을 겪는다. 가변 길이는 그 반대이다.

프로세스는 통신 연결을 설정해야 한다. 연결을 설정하기 위해서는 프로세스 식별 방식, 동기화 방식과 버퍼링 방식을 정해야 한다.

#### 명명 (프로세스 식별)

- **직접 통신**

    송수신자의 이름을 정확히 지정해야 한다. 송신자, 수신자 모두 서로의 이름을 아는 대칭 기법과, 송신자만 수신자의 이름을 아는 비대칭 기법으로 나눌 수 있다. 직접 통신은 이름을 하드 코딩해서 넣어줘야 하기 때문에 바람직하지 않다.

- **간접 통신**

  공유 메모리의 버퍼와 비슷하게, 메일박스(혹은 포트)를 송신자와 수신자 사이에 둔다. 메일박스는 여러 개를 만들 수 있고 각각 고유의 식별자를 가진다. 연결은 프로세스들와 메일박스 사이에서 이루어지고, 여러 개의 프로세스가 하나의 메일박스를 사용할 수 있다.

  메일박스를 동시에 참조해 메시지가 중복되는 걸 방지하는 방법은 다음과 같다.

  - 하나의 링크는 최대 두 개의 프로세스만 연관되도록 허용한다. (송신자, 수신자)
  - 한 순간에 하나의 프로세스만 receive 연산을 수행하게 한다.
  - 시스템이 특정 프로세스를 선택해서 할당한다. 라운드 로빈 같은 알고리즘을 사용한다.

  메일박스는 프로세스나 운영체제에 의해 소유될 수 있고, 소유자와 사용자를 따로 식별한다. 프로세스가 만든 메일박스는 프로세스가 종료되면 사라지는 반면 운영체제가 만든 메일박스는 계속 유지된다.

#### 동기화

메시지 전달은 송수신을 기다리는지 여부에 따라 blocking과 non-blocking으로 나뉜다.

- **블로킹 송신** : 메시지를 송신하고, 상대가 수신할 때까지 기다린다.
- **블로킹 송신** : 메시지를 송신하고, 작업을 계속 진행한다.
- **논블로킹 수신** : 메시지를 수신할 때까지 기다린다.
- **논블로킹 수신** : 메시지 수신을 시도하고, 유효한 메시지나 null을 받은 후 작업을 계속 진행한다.

send와 receive가 모두 blocking일 경우, 송수신자 간에 랑데부를 이뤘다고  한다.

#### 버퍼링

직접 통신이든 간접 통신이든 메시지는 임시 큐에 존재하게 된다.

- **무용량(zero capacity)** : 큐의 길이가 0이기 때문에 메시지는 임시 큐에 대기할 수 없다. 따라서 송신자는 무조건 블로킹된다.
- **유한 용량** : [공유 메모리 시스템](https://www.notion.so/42bce069d1984e06aaf0e2c7998fa0e4?pvs=21)의 유한 버퍼와 비슷하다. 송신자는 블로킹될 수 있다.
- **무한 용량** : [공유 메모리 시스템](https://www.notion.so/42bce069d1984e06aaf0e2c7998fa0e4?pvs=21)의 무한 버퍼와 비슷하다. 송신자는 절대 블로킹되지 않는다.

## 클라이언트-서버 통신

공유 메모리와 메시지 전달 기법을 응용해 클라이언트-서버 환경에서 통신하는 기법을 만들 수 있다. 소켓(socket), 원격 프로세저 호출(RPC)과 파이프(pipe)를 설명한다.

### 소켓

소켓은 통신의 끝점(endpoint)를 말한다. 하나의 통신에는 두 개의 소켓이 한 쌍으로 묶여야 하고, 각 소켓은 IP 주소와 포트 번호로 식별한다. 클라이언트는 서버의 알려진 포트에 요청을 보내 연결을 수립한다. 이때 클라이언트는 1024 이상의 임의의 포트 번호를 선택해 서버에게 알려주고, 실제 수신은 해당 포트로 한다. 알려진 포트로는 23번(telnet), 21번(ftp), 80번(http) 등이 있다.

소켓 통신은 분산된 프로세스들 간에 널리 사용되고 효율적이지만 너무 저수준이다. 소켓은 바이트 스트림 데이터만 보낼 수 있고, 이걸 해석하는 건 어플리케이션 단에서 진행해야 한다. 이 문제는 고수준인 RPC와 pipe으로 해결한다.

### 원격 프로시저 호출 (RPC, Remote Procedure Call)

RPC의 기본 개념은 클라이언트에서 서버의 함수를 호출하는 것이다.

#### 구동 방식

클라이언트는 RPC 함수의 stub을 가진다. stub은 실제 구현은 없는 인터페이스로, 함수의 시그니처만 명시되어 있다. 클라이언트은 RPC 라이브러리를 통해 stub과 매개변수를 호출할 수 있다. RPC 라이브러리는 매개변수를 정돈(marshall)해 메시지로 만든다. 그 후 메시지 전달 모델을 이용해 서버로 메시지를 보낸다. 서버는 stub을 구현한다. 클라이언트에서 서버로 RPC 메시지가 오면 구현된 함수를 실행하고 반환값을 다시 클라이언트에게 넘긴다.

#### 문제점과 해결

시스템별로 데이터를 표현하는 방식이 다르다. 시스템은 리틀 엔디안 혹은 빅 엔디안을 선택하는 등 천차만별이다. 따라서 시스템에 상관없이 통신할 수 있는 규격이 필요했고, stub을 표현하는 방식으로 XDR(external data representation)을 사용한다. RPC 라이브러리가 매개변수를 정돈할 때 시스템별 특징을 고려해 XDR로 바꾼다.

RPC는 네트워크로 통신하기 때문에 실패할 수도 있고 중복될 수도 있다. 하지만 RPC는 무조건 단 한 번만 실행됨을 보장해야 한다. 이를 위해 메시지에 타임스탬프를 기록하고, 서버가 중복된 타임스탬프를 거르게 한다. 또 서버가 RPC 요청을 받으면 클라이언트로 승인(ACK) 메시지를 보내 받았다고 알린다.

또 다른 문제는 서버의 포트를 클라이언트가 어떻게 아느냐는 것이다. 한 가지 방법은 하드 코딩된 포트를 사용하는 것이다. 이 방법은 포트가 고정되있기 때문에 포트 중복이 발생하면 서버가 동작하지 않을 수 있다. 다른 방법은 서버의 알려진 포트에 랑데부 데몬(matchmaker)를 두는 방식이다. 클라이언트는 연결을 시작할 때 랑데부 데몬에게 RPC 서버의 포트를 묻는다. 이 방식은 초기 연결에 오버헤드가 있지만 훨씬 유연하다.

#### 사용

RPC는 분산 파일 시스템(DFS)을 구현하는 데 유용하다. 파일 관련한 함수 read, write만 구현하고 원격으로 호출하면 손쉽게 파일을 저장하고 불러올 수 있다. 또 RPC는 마이크로서비스 아키텍쳐(MSA)의 통신에 주로 사용된다. 2022년 기준으로 [gRPC](https://grpc.io/)가 핫하니 한 번 살펴보시라.

### 파이프

같은 기계 내에서 프로세스끼리 통신할 때만 사용할 수 있다. UNIX CLI에서 흔히 쓰는 `ls | more`이 파이프의 대표적인 예이다.

#### 일반 파이프

일반 파이프를 생성하면 두 프로세스는 각각 읽기 종단과, 쓰기 종단을 얻는다. 읽기/쓰기 종단은 특수한 파일로 취급되고 read/write 시스템 호출로 접근한다. 한 프로세스는 write(WRITE_END)로 쓰고, 다른 프로세스는 read(READ_END)로 읽는다. 일반 파이프는 생성한 프로세스와 부모의 자원을 상속받는 자식 프로세스만 사용할 수 있다. 따라서 일반 파이프는 부모와 자식간의 통신에 사용하고 통신이 끝나면 사라진다.

#### 지명 파이프(Named Pipe)

지명 파이프는 반이중 통신(양방향이 가능하지만, 동시에 전송 불가)을 지원하고, 부모-자식 관계일 필요가 없으며 여러 프로세스가 접근할 수 있다. UNIX에서는 FIFO라 부르고 파일시스템의 보통 파일처럼 존재한다. mkfifo 시스템 호출로 생성하는 것 외에는 read, open 같이 일반 파일에 접근하는 호출을 사용한다.
