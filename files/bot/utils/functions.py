import time
import logging
import datetime
import os
from typing import *

end_message = "############ End of Message ##############"
start_message = "############ Start of Message ##############"

import time

def get_msg(file_path, token=end_message, poll_interval=1):
    """Reads a file until it finds the specified token and returns the message."""
    # Wait until the file has some contents and the token is found
    while True:
        try:
            with open(file_path, 'r') as f:
                contents = f.read()
                if contents and token in contents:
                    print('file not empty and has final content')
                    break
        except FileNotFoundError:
            raise

        time.sleep(poll_interval)

    # Read the contents of the file until the token is found
    message = ''
    with open(file_path, 'r+') as f:
        for line in f:
            if token in line:
                break
            message += line
        time.sleep(1)
        f.truncate(0)
    
    print('copied the contents')

    return message

def send_msg(file, res):
    """
    Send a message to the file
    """
    with open(file, 'a+') as f:
        f.write(res+'\n'+end_message)



def start_logging(fname:str, priority) -> Callable:
    """ """
    timestamp = datetime.datetime.now().strftime('%m-%d')

    os.makedirs('logs', exist_ok=True)
    # Configure the logging module
    logging.basicConfig(
        filename=f'logs/main_{timestamp}',  # Specify the filename of the log file
        level=priority,     # Set the logging level to DEBUG, which logs all messages
        format=f'{fname} %(asctime)s %(levelname)s: %(message)s',  # Define the format of the log messages
        datefmt=r'%m-%d',
    )
    # create the logging function
    def log (msg, prio='info'):
        if prio == 'info':
            print(msg)
        types = {
            'debug': logging.debug,
            'info': logging.info,
            'error': logging.error,
        }
        types[prio](msg)
    log(f'started {fname}')
    return log

