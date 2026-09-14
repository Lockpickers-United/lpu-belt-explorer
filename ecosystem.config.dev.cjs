module.exports = {
    apps: [{
        name: 'explore-lpubelts-server-dev',
        cwd: '/home/dh_m5s5pf/explore-lpubelts-com-node',
        script: '/home/dh_m5s5pf/explore-lpubelts-com-node/src/exploreLPUbeltsServer.js',
        node_args: '',
        instances: 1,
        exec_mode: 'fork',
        merge_logs: true,
        out_file: '/home/dh_m5s5pf/logs-local/exploreLPUbeltsServerDEV-out.log',
        error_file: '/home/dh_m5s5pf/logs-local/exploreLPUbeltsServerDEV-error.log',
        env: {
            NODE_ENV: 'development'
        }
    }]
}
