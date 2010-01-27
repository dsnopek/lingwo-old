

def make_app(global_conf, **local_conf):
    from AnkiServer.app import AnkiServerApp
    from paste import translogger

    # setup the logger
    logging_config_file = local_conf.get('logging.config_file')
    if logging_config_file:
        import logging.config
        logging.config.fileConfig(logging_config_file)

    app = AnkiServerApp(
        data_root=local_conf.get('data_root', '.')
    )
    # TODO: this should be configurable and, um, better.
    app = translogger.TransLogger(app)
    return app

