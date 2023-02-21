from django.http import JsonResponse
from health_check.views import MainView


class AllInOneHealthCheck(MainView):

    def render_to_response_json(self, plugins, status):
        """
        @param plugins:
        @param status:
        @return:
            0 if status of all plugins are ok.
            -1 if there is a problem in some plugins.
        """
        status_code = 0 if status == 200 else -1

        return JsonResponse(
            status_code,
            status=status,
            safe=False,
        )

