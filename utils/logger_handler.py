import logging
from utils.path_tool import get_abs_path
import os
from datetime import datetime

# 日志保存的根目录
LOG_ROOT = get_abs_path("logs")

# 确保日志的目录存在
os.makedirs(LOG_ROOT, exist_ok=True)

# 日志的格式配置 error info debug
DEFAULT_LOG_FORMAT = logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(filename)s:%(lineno)d - %(message)s'
)
# asctime：记录日志产生的时间，用于追溯问题发生的时间点
# name：标识这条日志来自哪个日志器（通常按模块或功能命名），方便区分不同部分的日志
# levelname：表示日志的重要等级（如 DEBUG、INFO、ERROR），便于过滤或快速定位严重问题
# filename：哪个源代码文件产生了这条日志，帮助快速定位代码位置
# lineno：具体在第几行，配合 filename 可以精确找到日志调用的代码行
# message：程序员自定义的日志内容，描述具体发生了什么事件


def get_logger(
        name: str = "agent",
        console_level: int = logging.INFO,
        file_level: int = logging.DEBUG,
        log_file=None
) -> logging.Logger:
    # 获取日志器，并设置级别
    logger = logging.getLogger(name)
    logger.setLevel(logging.DEBUG)

    # 避免重复添加Handler，防止重复添加导致同一条日志输出多次
    if logger.handlers:
        return logger

    # 控制台Handler（在控制台显示）
    console_handler = logging.StreamHandler()
    console_handler.setLevel(console_level)
    console_handler.setFormatter(DEFAULT_LOG_FORMAT)

    logger.addHandler(console_handler)

    # 文件Handler（在文件显示）
    if not log_file:  # 日志文件的存放路径
        log_file = os.path.join(LOG_ROOT, f"{name}_{datetime.now().strftime('%Y%m%d')}.log")
    file_handler = logging.FileHandler(log_file, encoding='utf-8')
    file_handler.setLevel(file_level)
    file_handler.setFormatter(DEFAULT_LOG_FORMAT)

    logger.addHandler(file_handler)

    return logger


# 快捷获取日志器
logger = get_logger()