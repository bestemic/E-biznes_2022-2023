FROM ubuntu:22.04

ENV TZ = "Europe/Warsaw"

RUN apt-get update && \
    apt-get -y install --no-install-recommends software-properties-common curl unzip zip

RUN adduser student

RUN mkdir /home/student/backend

COPY ./app /home/student/backend/app
COPY ./conf /home/student/backend/conf
COPY ./project /home/student/backend/project
COPY ./public /home/student/backend/public
COPY ./build.sbt /home/student/backend/build.sbt
COPY ./build.sc /home/student/backend/build.sc
COPY ./.g8 /home/student/backend/.g8

RUN chown -R student:student /home/student/backend
RUN chmod -R 755 /home/student/backend

USER student
WORKDIR /home/student/

RUN curl -s "https://get.sdkman.io" | bash
RUN bash -c "source $HOME/.sdkman/bin/sdkman-init.sh && sdk install java 8.0.362-amzn"
RUN bash -c "source $HOME/.sdkman/bin/sdkman-init.sh && sdk install sbt 1.8.2"
RUN bash -c "source $HOME/.sdkman/bin/sdkman-init.sh && sdk install scala 2.13.10"

ENV PATH=$PATH:/home/student/.sdkman/candidates/sbt/1.8.2/bin
ENV PATH=$PATH:/home/student/.sdkman/candidates/java/8.0.362-amzn/bin/
ENV PATH=$PATH:/home/student/.sdkman/candidates/scala/2.13.10/bin

WORKDIR backend

EXPOSE 9000

CMD ["sbt", "run"]