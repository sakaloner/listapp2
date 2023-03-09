from telegram import Update, InlineQueryResultArticle, InputTextMessageContent
from telegram.ext import InlineQueryHandler, ApplicationBuilder, ContextTypes, CommandHandler, filters, MessageHandler
from telegram import Update, InlineQueryResultArticle, InputTextMessageContent, MessageEntity

from utils.functions import *
import datetime

log = start_logging('TelegramBot', logging.INFO)


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    log('Received /start command')
    print('start')
    await context.bot.send_message(
        chat_id=update.effective_chat.id, 
        text="I'm a bot, please talk to me!"
    )

async def echo(update: Update, context: ContextTypes.DEFAULT_TYPE):
    print(update)
    user_entities = update.message.parse_entities(
        [MessageEntity.MENTION, MessageEntity.TEXT_MENTION]
    )
    # get text of the message
    text = update.message.text
    if ('@Parce420Bot' in user_entities.values()):
        text = update.message.text.replace('@Parce420Bot', '')
        if (update.message.from_user.id == 871787184):
            bot_res = 'you are the owner'
        else:
            bor_res = (text)
    else:
        bot_res = (text)
    
    # if(update.MessageEntity.type == MessageEntity.MENTION):
    #     bot_res= 'somebody talked to me'
    # print('recieved echo')
    # log('Received user message')
    # user_msg = update.message.text
    # user_msg = user_msg.replace('@Parce420Bot', '')
    # log('User Message: ' + user_msg)
    # send_msg('coms/user_msg.txt', user_msg)
    # log('Waiting for bot response')
    # bot_res = get_msg('coms/bot_msg.txt')
    # log('received bot response. Sending it to user')    
    await context.bot.send_message(
        chat_id=update.effective_chat.id, 
        text= bot_res
    )


# async def bot_mentioned(update: Update, context: ContextTypes.DEFAULT_TYPE):
#     log('mentiones bot')
#     # get the message text and entities
#     message = update.message.text
#     entities = update.message.entities

#     # check if any of the entities are mentions of the bot
#     for entity in entities:
#         if entity.type == MessageEntity.MENTION and entity.user.username == 'TheNameOfTheBot':
#             # if the bot is mentioned, send a response
#             await context.bot.send_message(chat_id=update.effective_chat.id, text="Hello, how are you?")


if __name__ == '__main__':
    application = ApplicationBuilder().token('931609591:AAHldMP8h6PIAzMkMpLE-NKJIUY3ljX3418').build()
    
    # bot_mentioned_handler = MessageHandler(filters.Entity("mention"), bot_mentioned)
    echo_handler = MessageHandler(filters.TEXT & (~filters.COMMAND), echo)
    start_handler = CommandHandler('start', start)
    
    # application.add_handler(bot_mentioned_handler)  
    application.add_handler(echo_handler)
    application.add_handler(start_handler)

    
    application.run_polling()