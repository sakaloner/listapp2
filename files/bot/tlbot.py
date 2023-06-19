#!/usr/bin/env python3
from telegram import Update, InlineQueryResultArticle, InputTextMessageContent, MessageEntity
from telegram.ext import InlineQueryHandler, ApplicationBuilder, ContextTypes, CommandHandler, filters, MessageHandler
from utils.functions import *
from chatgpt import get_chatbot_response
from telegram.error import NetworkError
import datetime
import asyncio
import listapp

print('bro')
log = start_logging('TelegramBot', logging.INFO)

async def retry_on_error(func, wait=0.1, retry=2, *args, **kwargs):
    i = 0
    while True:
        try:
            return await func(*args, **kwargs)
            break
        except NetworkError:
            logging.exception(f"Network Error. Retrying...{i}")
            i += 1
            await asyncio.sleep(wait)
            if retry != 0 and i == retry:
                break

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    log('Received /start command')
    user_id = update.message.from_user.id
    bot_res = f"Log into your Listapp account using this link:\nhttp://listapp.be.sexy/login_telegram?telegram_id={user_id}\nIf you dont have a Listapp account you can register here:\nhttp://listapp.be.sexy/register\n then login using the first link"
    await context.bot.send_message(
        chat_id=update.effective_chat.id, 
        text=bot_res
    )


# async def echo(update: Update, context: ContextTypes.DEFAULT_TYPE):
#     # get entities of the message
#     user_entities = update.message.parse_entities(
#         [MessageEntity.MENTION, MessageEntity.TEXT_MENTION]
#     )
#     # get text of the message
#     text = update.message.text
#     if ('@Parce420Bot' in user_entities.values()):
#         text = update.message.text.replace('@Parce420Bot', '')
#         if (update.message.from_user.id == 871787184):
#             bot_res = get_chatbot_response(text)
#         else:
#             bot_res = get_chatbot_response(text)

#     await context.bot.send_message(
#         chat_id=update.effective_chat.id,
#         text=bot_res
#     )


async def echo_private(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_entities = update.message.parse_entities(
        [MessageEntity.MENTION, MessageEntity.TEXT_MENTION]
    )
    log('Received private message')
    user_id = update.message.from_user.id
    print(user_id)
    ## If user is not logged in send message for him to login
    if listapp.get_user_from_db(tl_id=user_id) == None:
        print('user not logged in')
        user_id = update.message.from_user.id
        bot_res = f"Log into your Listapp account using this link:\nhttp://listapp.be.sexy/login_telegram?telegram_id={user_id}\nIf you dont have a Listapp account you can register here:\nhttp://listapp.be.sexy/register\n then login using the first link"
        await context.bot.send_message(
            chat_id=update.effective_chat.id,
            text=bot_res
        )
        return

    user_msg = update.message.text

    log(f'User message: {user_msg}')
    bot_res = get_chatbot_response(user_msg, user_id)

    await retry_on_error(context.bot.send_message, 10, 3, chat_id=update.effective_chat.id, text=bot_res)
    # await context.bot.send_message(
    #     chat_id=update.effective_chat.id, 
    #     text=bot_res
    # )


if __name__ == '__main__':
    application = ApplicationBuilder().token('931609591:AAHldMP8h6PIAzMkMpLE-NKJIUY3ljX3418').build()
    
    # (Filters.text & Filters.entity(MENTION))
    # bot_mentioned_handler = MessageHandler(filters.Entity("mention"), bot_mentioned)
    echo_private = MessageHandler(filters.ChatType.PRIVATE | filters.Entity('mention'), echo_private)
    # echo_handler = MessageHandler(filters.TEXT & (~filters.COMMAND), echo)
    start_handler = CommandHandler('start', start)
    
    # application.add_handler(bot_mentioned_handler)

    application.add_handler(start_handler)
    application.add_handler(echo_private)
    # application.add_handler(echo_handler)

    
    application.run_polling()
