

TARGET := 24
CC := arm-linux-gcc


CSRCS := $(wildcard *.c)
CSRCS += $(wildcard sub/*.c)
#CSRCS += $(wildcard mp3/*.c)


OBJS := $(patsubst %.c, %.o, $(CSRCS))

$(TARGET): $(OBJS) 
	$(CC) $+ -o $@

%.o:%.c
	$(CC) -c $< -o $@


clean:
	rm -rf $(OBJS) $(TARGET)
