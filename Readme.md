################################## Log Monitor ###########################################

#Application brief

 - Application detects whether the system is attacked or not based on predefined params
 - User uploaded .log or .txt files and defines the log file pattern
 - Output file is generated and browser prompts to download.
 - Output file consists of boolean flag YES/NO for each line of log.
 - Params harcoded at server for attack: ORIGIN_HEADER as "MATLAB 2013a" and CLIENT_IP is Non-Indian

# Application Stack Info

 - Application is developed in nodejs?express backend and jQuery in front-end
 - Each log file is uploaded as multipart/FormData
 - As soon as the file is received, it is streamed rather than reading entire file in memory
 - Processed log file is generated an dsent to client
