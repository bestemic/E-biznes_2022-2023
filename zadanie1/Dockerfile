FROM ubuntu:22.04

ENV TZ = "Europe/Warsaw"

RUN apt-get update && \
    apt-get -y install software-properties-common tzdata && \
    add-apt-repository ppa:deadsnakes/ppa && \
    apt-get -y install python3.8

RUN useradd -ms /bin/bash bestemic
RUN adduser bestemic sudo

USER bestemic
WORKDIR /home/bestemic/
RUN mkdir ebiznes
WORKDIR /home/bestemic/ebiznes