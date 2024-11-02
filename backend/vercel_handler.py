from backend.project.wsgi import application

# Vercel serverless handler
def handler(event, context):
    return application(event, context)